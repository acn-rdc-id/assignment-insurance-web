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

  readonly MAX_BENEFICIARIES: number = 2;
  readonly RELATIONSHIP_OPTIONS: string[] = [
    'Spouse', 'Child', 'Parent', 'Sibling', 'Relative', 'Other'
  ];

  currentPolicyNo: string | null = '';
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

  createBeneficiaryForm(data?: any): FormGroup {
    return this.formBuilder.group({
      id: [data?.id || null],
      beneficiaryName: new FormControl(data?.beneficiaryName ?? '', Validators.required),
      relationshipToInsured: new FormControl(data?.relationshipToInsured ?? '', Validators.required),
      share: new FormControl(data?.share ?? 0, [Validators.required, Validators.min(0), Validators.max(100)])
    });
  }

  loadInitialBeneficiaries(): void {
    if (!this.currentPolicyNo) return;

    const beneficiaryList = this.store.selectSnapshot(PolicyProductState.getPolicyBeneficiaries);
    const beneficiary = beneficiaryList.find((entry: { policyNo: string; }) => entry.policyNo?.trim() === this.currentPolicyNo!.trim());
    const initialBeneficiaries = beneficiary?.beneficiaryList ?? [];

    this.formArray.clear();
    initialBeneficiaries.forEach((data: any) => {
      this.formArray.push(this.createBeneficiaryForm(data));
    });
  }

  addRow(): void {
    if (this.formArray.length >= this.MAX_BENEFICIARIES) return;
    this.formArray.push(this.createBeneficiaryForm());
  }

  removeRow(index: number): void {
    this.formArray.removeAt(index);
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

  getExistingBeneficiaries(beneficiariesState: any[]): any[] {
    const existingEntry = beneficiariesState.find(item => item.policyNo?.trim() === this.currentPolicyNo?.trim());
    return existingEntry?.beneficiaryList || [];
  }

  getUpdatedOrCreatedBeneficiaries(current: any[], existing: any[]): any[] {
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

  getDeletedBeneficiaries(current: any[], existing: any[]): any[] {
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
    const beneficiariesState = this.store.selectSnapshot(PolicyProductState.getPolicyBeneficiaries);
    const existingEntry = this.getExistingBeneficiaries(beneficiariesState);
    const currentFormValues = this.formArray.value;

    const updatedOrCreated = this.getUpdatedOrCreatedBeneficiaries(currentFormValues, existingEntry);
    const deleted = this.getDeletedBeneficiaries(currentFormValues, existingEntry);

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
    this.route.paramMap.subscribe(params => {
      this.currentPolicyNo = params.get('policyNo');
      this.loadInitialBeneficiaries();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
