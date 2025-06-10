import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {Subject} from 'rxjs';
import {Store} from '@ngxs/store';

import {FORMFIELD_DEFAULT_OPTIONS, NxFormfieldComponent} from '@aposin/ng-aquila/formfield';
import {
  NxHeaderCellDirective,
  NxTableCellComponent,
  NxTableComponent,
  NxTableRowComponent
} from '@aposin/ng-aquila/table';
import {DATEPICKER_DEFAULT_OPTIONS} from '@aposin/ng-aquila/datefield';
import {NxButtonComponent, NxPlainButtonComponent} from '@aposin/ng-aquila/button';
import {NxIconComponent} from '@aposin/ng-aquila/icon';
import {NxInputDirective} from '@aposin/ng-aquila/input';
import {NxMomentDateModule} from '@aposin/ng-aquila/moment-date-adapter';
import {MessageModalData} from '../../models/message-modal-data.model';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {NxDialogService, NxModalRef} from '@aposin/ng-aquila/modal';
import {PolicyProductState} from '../../store/policy-product/policy-product.state';
import {ActivatedRoute} from '@angular/router';
import {ActionType} from '../../enums/action.enum';
import {LoadAllPolicies, PostListBeneficiaries} from '../../store/policy-product/policy-product.action';
import {NxErrorComponent} from '@aposin/ng-aquila/base';
import {NxDropdownComponent, NxDropdownItemComponent} from '@aposin/ng-aquila/dropdown';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {NxMessageComponent} from '@aposin/ng-aquila/message';
import {HttpErrorBody} from '../../models/http-body.model';
import { MAX_BENEFICIARIES, PolicyBeneficiary, PolicyDetails } from '../../models/policy.model';
import { BeneficiaryRelationship } from '../../enums/beneficiary-relationship.enum';

@Component({
  selector: 'app-policy-servicing-beneficiary',
  templateUrl: './policy-servicing-beneficiary.component.html',
  styleUrl: './policy-servicing-beneficiary.component.scss',
  providers: [
    {
      provide: FORMFIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', nxFloatLabel: 'always' }
    },
    {
      provide: DATEPICKER_DEFAULT_OPTIONS,
      useValue: { toggleIconTabindex: -1 }
    }
  ],
  imports: [
    NxTableComponent,
    NxTableRowComponent,
    NxHeaderCellDirective,
    NxTableCellComponent,
    NxFormfieldComponent,
    NxInputDirective,
    NxPlainButtonComponent,
    NxIconComponent,
    NxMomentDateModule,
    FormsModule,
    ReactiveFormsModule,
    NxButtonComponent,
    NxErrorComponent,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxLayoutComponent,
    NxRowComponent,
    NxColComponent,
    NxMessageComponent,
  ]
})
export class PolicyServicingBeneficiaryComponent implements OnInit, OnDestroy {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: Store = inject(Store);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogService: NxDialogService = inject(NxDialogService);
  private unsubscribe$ = new Subject<void>();


  beneficiaryRelatioshipList: Array<string> = Object.values(BeneficiaryRelationship);
  currentPolicyNo: string | null = '';
  currentPolicyId!: number;
  dialogRef?: NxModalRef<any>;
  submitted: boolean = false;
  isBeneficiaryError: boolean = false;
  errorMessage: string = '';
  successMessage: boolean = false;

  beneficiaryDetailsForm = this.formBuilder.group({
    beneficiaries: this.formBuilder.array<FormGroup>([])
  });

  get formArray(): FormArray<FormGroup> {
    return this.beneficiaryDetailsForm.get('beneficiaries') as FormArray<FormGroup>;
  }

  createBeneficiaryForm(data: PolicyBeneficiary): FormGroup {
    return this.formBuilder.group({
      id: [data.id || null],
      beneficiaryName: new FormControl(data.beneficiaryName ?? '', Validators.required),
      relationshipToInsured: new FormControl(data.relationshipToInsured ?? '', Validators.required),
      share: new FormControl(data?.share ?? 0, [Validators.required, Validators.min(0), Validators.max(100)])
    });
  }

  loadInitialBeneficiaries(): void {
    if (!this.currentPolicyNo) return;

    const beneficiaryList: Array<PolicyBeneficiary> = this.store.selectSnapshot(PolicyProductState.getPolicyBeneficiaries);
    this.formArray.clear();
    if (beneficiaryList.length > 0) {
      beneficiaryList.forEach((data: PolicyBeneficiary) => {
        this.formArray.push(this.createBeneficiaryForm(data));
      });
    }
  }

  addRow(): void {
    if (this.formArray.length >= MAX_BENEFICIARIES) return;
    const newBeneficiary: PolicyBeneficiary = {
      beneficiaryName: '',
      relationshipToInsured: '',
      share: 0
    };
    this.formArray.push(this.createBeneficiaryForm(newBeneficiary));
  }

  removeRow(index: number): void {
    this.formArray.removeAt(index);
  }

  shouldShowErrorMessage(): boolean {
    return this.submitted && (this.beneficiaryDetailsForm.invalid || this.isBeneficiaryError) && this.errorMessage.trim() !== '';
  }

  showError(message: string): void {
    this.isBeneficiaryError = true;
    this.errorMessage = message;
  }

  showSuccess(): void {
    this.successMessage = true;
    setTimeout(() => this.successMessage = false, 5000);
  }

  clearErrors(): void {
    this.isBeneficiaryError = false;
    this.errorMessage = '';
  }

  getUpdatedOrCreatedBeneficiaries(current: Array<PolicyBeneficiary>, existing: Array<PolicyBeneficiary>): any[] {
    return current.map(item => {
      const isExisting: boolean = item.id !== null && existing.some(b => b.id === item.id);
      return {
        id: item.id,
        beneficiaryName: item.beneficiaryName,
        relationshipToInsured: item.relationshipToInsured,
        share: item.share,
        action: isExisting ? ActionType.UPDATE : ActionType.CREATE
      };
    });
  }

  getDeletedBeneficiaries(current: Array<PolicyBeneficiary>, existing: Array<PolicyBeneficiary>): any[] {
    const currentIds = current.map(item => item.id).filter(id => id !== null);
    return existing
      .filter(item => !currentIds.includes(item.id))
      .map(item => ({
        id: item.id,
        beneficiaryName: item.beneficiaryName,
        relationshipToInsured: item.relationshipToInsured,
        share: item.share,
        action: ActionType.DELETE
      }));
  }

  constructPayload(): any {
    const currentBeneficiariesList: Array<PolicyBeneficiary> = this.store.selectSnapshot(PolicyProductState.getPolicyBeneficiaries);
    const currentFormValues = this.formArray.value;

    const updatedOrCreated = this.getUpdatedOrCreatedBeneficiaries(currentFormValues, currentBeneficiariesList);
    const deleted = this.getDeletedBeneficiaries(currentFormValues, currentBeneficiariesList);

    return {
      policyNo: this.currentPolicyNo,
      beneficiaries: [...updatedOrCreated, ...deleted]
    };
  }

  submitForm(): void {
    this.submitted = true;

    const beneficiaries = this.formArray.value;

    if (beneficiaries.length > 0) {
      const totalShare: number = beneficiaries.reduce((sum, item) => sum + Number(item.share), 0);

      if (totalShare !== 100) {
        this.showError(`Total share must equal 100. Current total: ${totalShare}`);
        return;
      }
    }

    if (this.beneficiaryDetailsForm.invalid) {
      this.showError(`One or more required fields are incomplete or contain errors. Please correct them to continue.`);
      return;
    }

    const payload = this.constructPayload();

    this.store.dispatch(new PostListBeneficiaries(payload)).subscribe({
      next: (): void => {
        this.store.dispatch(new LoadAllPolicies());
        this.clearErrors();
        this.showSuccess();
      },
      error: (err: HttpErrorBody): void => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.'
        };
        this.openErrorModal(messageData);
      }
    });
  }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog'
    })
  }

  ngOnInit(): void {
    const policyDetails: PolicyDetails = this.store.selectSnapshot(PolicyProductState.getPolicyDetails);
    this.currentPolicyNo = policyDetails.quotationNumber;
    this.loadInitialBeneficiaries();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
