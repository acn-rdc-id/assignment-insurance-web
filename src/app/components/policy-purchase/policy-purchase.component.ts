import {Component, inject, OnDestroy, OnInit, signal, Signal} from '@angular/core';
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
import {formatCamelCase} from '../../utils/string-utils';
import { Subject, takeUntil } from 'rxjs';

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
export class PolicyPurchaseComponent implements OnInit, OnDestroy {
  store: Store = inject(Store);

  currentMainStep: Signal<PolicyPurchaseStep> = signal({ step: 1, path: 'basic-information' });
  currentSubStep: Signal<PolicyPurchaseStep> = signal({ step: 1, path: 'info-details' });

  mainSteps: PolicyPurchaseStep[] = [];
  subSteps: PolicyPurchaseStep[] = [];

  unsubscribe$ = new Subject();

  initSteps(): void {
    this.store.select(PolicyPurchaseState.getMainSteps)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(steps => {
      this.mainSteps = steps;
    });

    this.store.select(PolicyPurchaseState.getSubSteps)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(steps => {
      this.subSteps = steps;
    });

    this.currentMainStep = this.store.selectSignal(PolicyPurchaseState.getCurrentMainStep);
    this.currentSubStep = this.store.selectSignal(PolicyPurchaseState.getCurrentSubStep);
  }

  submitStep(step: number, path: string): void {
    this.store.dispatch(new SubmitPolicyPurchaseStep({ step: step, path: path }));
  }

  submitSubStep(step: number, path: string): void {
    this.store.dispatch(new SubmitPolicyPurchaseSubStep({ step: step, path: path }));
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
    if (this.currentMainStep().step < this.mainSteps.length) {
      const nextStep: PolicyPurchaseStep = this.mainSteps[this.currentMainStep().step];
      this.onStepChange(nextStep.step, nextStep.path);
    }
  }

  nextSubStep(): void {
    if (this.currentSubStep().step < this.subSteps.length) {
      const nextStep: PolicyPurchaseStep = this.subSteps[this.currentSubStep().step];
      this.onSubStepChange(nextStep.step, nextStep.path);
    }
  }

  prevStep(): void {
    if (this.currentMainStep().step > 1) {
      const prevStep: PolicyPurchaseStep = this.mainSteps[this.currentMainStep().step - 2];
      this.onStepChange(prevStep.step, prevStep.path);
    }
  }

  prevSubStep(): void {
    if (this.currentSubStep().step > 1) {
      const prevStep: PolicyPurchaseStep = this.subSteps[this.currentSubStep().step - 2];
      this.onSubStepChange(prevStep.step, prevStep.path);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('');
    this.unsubscribe$.complete();
  }

  protected readonly formatCamelCase = formatCamelCase;
}
