import {Component, inject, OnInit} from '@angular/core';
import {
  PolicyPurchaseInitialInfoComponent
} from '../policy-purchase-initial-info/policy-purchase-initial-info.component';
import {NxCardComponent, NxCardSecondaryInfoDirective,} from '@aposin/ng-aquila/card';
import {NxHeadlineComponent} from '@aposin/ng-aquila/headline';
import {NxProgressStepperComponent, NxStepComponent,} from '@aposin/ng-aquila/progress-stepper';
import {PolicyPurchasePlanComponent} from '../policy-purchase-plan/policy-purchase-plan.component';
import {PolicyPurchaseSummaryComponent} from '../policy-purchase-summary/policy-purchase-summary.component';
import {ReactiveFormsModule,} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PolicyPurchaseStep} from '../../models/policy.model';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {SubmitPolicyPurchaseStep, SubmitPolicyPurchaseSubStep} from '../../store/policy/policy-purchase.action';
import {ProgressbarComponent} from '../progress-bar/progressbar.component';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';
import {
  PolicyPurchaseInsuredInfoComponent
} from '../policy-purchase-insured-info/policy-purchase-insured-info.component';
import {PolicyPurchaseReceiptComponent} from '../policy-purchase-receipt/policy-purchase-receipt.component';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-policy-purchase',
  imports: [
    PolicyPurchaseInitialInfoComponent,
    NxCardComponent,
    NxCardSecondaryInfoDirective,
    NxHeadlineComponent,
    NxProgressStepperComponent,
    NxStepComponent,
    PolicyPurchasePlanComponent,
    PolicyPurchaseSummaryComponent,
    ReactiveFormsModule,
    ProgressbarComponent,
    NxColComponent,
    NxLayoutComponent,
    NxRowComponent,
    PolicyPurchaseInsuredInfoComponent,
    PolicyPurchaseReceiptComponent,
    NgClass,
  ],
  templateUrl: './policy-purchase.component.html',
  styleUrl: './policy-purchase.component.scss',
})
export class PolicyPurchaseComponent implements OnInit {
  store: Store = inject(Store);

  currentStep: number = 1;
  currentSubStep: number = 1;
  currentPath: string = 'basic-information';
  currentSubPath: string = 'info-details';
  paymentStatus: number | null = null;

  mainSteps: PolicyPurchaseStep[] = [];
  subSteps: PolicyPurchaseStep[] = [];

  initSteps(): void {
    this.store.select(PolicyPurchaseState.getMainSteps).subscribe(steps => {
      this.mainSteps = steps;
      this.submitStep(this.currentStep, this.currentPath);
    });

    this.store.select(PolicyPurchaseState.getSubSteps).subscribe(steps => {
      this.subSteps = steps;
      this.submitSubStep(this.currentSubStep, this.currentSubPath);
    });
  }

  submitStep(step: number, path: string): void {
    this.store.dispatch(new SubmitPolicyPurchaseStep({ step: step, path: path }));
  }

  submitSubStep(step: number, path: string): void {
    this.store.dispatch(new SubmitPolicyPurchaseSubStep({ step: step, path: path }));
  }

  onPaymentResult(status: number) {
    this.paymentStatus = status;
  }

  formatCamelCase(path: string): string {
    return path
      .split('-')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  ngOnInit(): void {
    this.initSteps();
  }

  onStepChange(newStep: number, path: string): void {
    this.submitStep(newStep, path);
  }

  onSubStepChange(newStep: number, path: string): void {
    this.submitSubStep(newStep, path);
  }

  nextStep(): void {
    if (this.currentStep < this.mainSteps.length) {
      const nextStep: PolicyPurchaseStep = this.mainSteps[this.currentStep];
      this.onStepChange(nextStep.step, nextStep.path);
      this.currentStep++;
    }
  }

  nextSubStep(): void {
    if (this.currentSubStep < this.subSteps.length) {
      const nextStep: PolicyPurchaseStep = this.subSteps[this.currentSubStep];
      this.onSubStepChange(nextStep.step, nextStep.path);
      this.currentSubStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      const prevStep: PolicyPurchaseStep = this.mainSteps[this.currentStep - 2];
      this.onStepChange(prevStep.step, prevStep.path);
      this.currentStep--;
    }
  }

  prevSubStep(): void {
    if (this.currentSubStep > 1) {
      const prevStep: PolicyPurchaseStep = this.subSteps[this.currentSubStep - 2];
      this.onSubStepChange(prevStep.step, prevStep.path);
      this.currentSubStep--;
    }
  }
}
