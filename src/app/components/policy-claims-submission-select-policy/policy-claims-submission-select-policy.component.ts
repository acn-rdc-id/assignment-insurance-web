import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NxButtonComponent } from '@aposin/ng-aquila/button';
import {
  NxDropdownComponent,
  NxDropdownItemComponent,
} from '@aposin/ng-aquila/dropdown';
import {
  NxFormfieldComponent,
  NxFormfieldModule,
} from '@aposin/ng-aquila/formfield';
import {
  NxDatefieldModule,
  NxNativeDateModule,
} from '@aposin/ng-aquila/datefield';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject, take } from 'rxjs';
import { HttpErrorBody } from '../../models/http-body.model';
import { MessageModalData } from '../../models/message-modal-data.model';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import {
  LoadPolicyClaim,
  SetPolicyClaimSelection,
} from '../../store/policy-claim/policy-claim.action';
import { PolicyClaimState } from '../../store/policy-claim/policy-claim.state';
import { PolicyClaimSubmissionDetails } from '../../models/policy-claim.model';

@Component({
  selector: 'app-policy-claims-submission-select-policy',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NxFormfieldComponent,
    NxFormfieldComponent,
    NxButtonComponent,
    NxFormfieldModule,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxDatefieldModule,
    NxNativeDateModule,
    RouterModule,
  ],
  templateUrl: './policy-claims-submission-select-policy.component.html',
  styleUrl: './policy-claims-submission-select-policy.component.scss',
})
export class PolicyClaimsSubmissionSelectPolicyComponent
  implements OnInit, OnDestroy
{
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;

  infoForm!: FormGroup;
  policyList: Array<{policyId: string, policyNo: string}> = [];
  typeOfClaim = [''];
  formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private store: Store = inject(Store);
  private dialogService = inject(NxDialogService);
  private unsubscribe$ = new Subject();
  dialogRef?: NxModalRef<any>;
  policyClaim?: PolicyClaimSubmissionDetails;

  ngOnInit(): void {
    this.initForms();

    this.store.dispatch(new LoadPolicyClaim()).subscribe({
      complete: () => {
        this.policyClaim = this.store.selectSnapshot(
          PolicyClaimState.getClaimSubmissionDetails
        );
        this.policyList = this.policyClaim.policyList;
        this.typeOfClaim = this.policyClaim.claimPolicyDocumentList.map(
          (it) => it.claimTypeName
        );
      },
      error: (err: HttpErrorBody) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.',
        };
        this.openErrorModal(messageData);
      },
    });

    this.store
      .select(PolicyClaimState.getSelectedPolicyId)
      .pipe()
      .subscribe((policyId) => {
        this.infoForm.get('policyId')?.setValue(policyId);
      });

    this.store
      .select(PolicyClaimState.getSelectedTypeOfClaim)
      .pipe()
      .subscribe((typeOfClaim) => {
        this.infoForm.get('typeOfClaim')?.setValue(typeOfClaim.claimTypeName);
      });
  }

  private openErrorModal(messageData?: MessageModalData): void {
    this.dialogRef = this.dialogService.open(MessageModalComponent, {
      data: messageData,
      disableClose: true,
      ariaLabel: 'Error dialog',
    });
  }

  initForms(): void {
    this.infoForm = this.formBuilder.group({
      policyId: new FormControl('', Validators.required),
      typeOfClaim: new FormControl('', Validators.required),
    });
  }

  onNext() {
    const formValues = this.infoForm.value;

    const payload = {
      policyId: formValues.policyId,
      typeOfClaim: this.policyClaim?.claimPolicyDocumentList.find(
        (claim) => claim.claimTypeName == formValues.typeOfClaim
      ),
    };

    this.store.dispatch(new SetPolicyClaimSelection(payload)).subscribe({
      complete: () => {
        this.nextStep();
      },
      error: (err: HttpErrorBody) => {
        const messageData: MessageModalData = {
          header: 'Error',
          message: err.message ?? 'Unexpected error occurred.',
        };
        this.openErrorModal(messageData);
      },
    });
  }

  onBack(): void {
    this.router.navigate(['/claim-list']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
