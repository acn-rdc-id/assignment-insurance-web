import { Component, inject } from '@angular/core';
import { NxCardComponent } from '@aposin/ng-aquila/card';
import { PolicyClaimsSubmissionSelectPolicyComponent } from '../policy-claims-submission-select-policy/policy-claims-submission-select-policy.component';
import { PolicyClaimStep } from '../../models/policy-claim.model';
import { SubmitPolicyClaimStep } from '../../store/policy-claim/policy-claim.action';
import { Store } from '@ngxs/store';
import { PolicyClaimState } from '../../store/policy-claim/policy-claim.state';
import { PolicyClaimsSubmissionUploadDocComponent } from '../policy-claims-submission-upload-doc/policy-claims-submission-upload-doc.component';

@Component({
  selector: 'app-policy-claims-submission',
  imports: [
    NxCardComponent,
    PolicyClaimsSubmissionSelectPolicyComponent,
    PolicyClaimsSubmissionUploadDocComponent,
  ],
  templateUrl: './policy-claims-submission.component.html',
  styleUrl: './policy-claims-submission.component.scss',
})
export class PolicyClaimsSubmissionComponent {
  store: Store = inject(Store);
  currentStep: number = 1;
  mainSteps: PolicyClaimStep[] = [];
  currentPath: string = 'claim-selection';

  nextStep(): void {
    if (this.currentStep < this.mainSteps.length) {
      const nextStep: PolicyClaimStep = this.mainSteps[this.currentStep];
      this.onStepChange(nextStep.step, nextStep.path);
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      const prevStep: PolicyClaimStep = this.mainSteps[this.currentStep - 2];
      this.onStepChange(prevStep.step, prevStep.path);
      this.currentStep--;
    }
  }

  onStepChange(newStep: number, path: string): void {
    this.submitStep(newStep, path);
  }

  submitStep(step: number, path: string): void {
    this.store.dispatch(new SubmitPolicyClaimStep({ step: step, path: path }));
  }

  ngOnInit(): void {
    this.initSteps();
  }

  initSteps(): void {
    this.store.select(PolicyClaimState.getMainSteps).subscribe((steps) => {
      this.mainSteps = steps;
      this.submitStep(this.currentStep, this.currentPath);
    });
  }
}
