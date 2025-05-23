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
import { PolicyClaim } from '../../models/policy-claim.model';

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
  policyId = [''];
  typeOfClaim = [''];
  formBuilder: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private store: Store = inject(Store);
  private dialogService = inject(NxDialogService);
  private unsubscribe$ = new Subject();
  dialogRef?: NxModalRef<any>;
  policyClaim?: PolicyClaim;

  ngOnInit(): void {
    this.store.dispatch(new LoadPolicyClaim()).subscribe({
      complete: () => {
        this.policyClaim = this.store.selectSnapshot(
          PolicyClaimState.getPolicyClaimList
        );
        this.policyId = this.policyClaim.policyId;
        this.typeOfClaim = this.policyClaim.claimPolicyDocument.map(
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
        this.infoForm.get('typeOfClaim')?.setValue(typeOfClaim);
      });

    this.initForms();
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
      typeOfClaim: this.policyClaim?.claimPolicyDocument.find(
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

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }
}
