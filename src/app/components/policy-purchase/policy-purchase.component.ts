import {Component, inject, OnInit} from '@angular/core';
import {
  PolicyPurchaseInitialInfoComponent
} from '../policy-purchase-initial-info/policy-purchase-initial-info.component';
import {NxCardComponent, NxCardSecondaryInfoDirective,} from '@aposin/ng-aquila/card';
import {NxHeadlineComponent} from '@aposin/ng-aquila/headline';
import {NxProgressStepperComponent, NxStepComponent,} from '@aposin/ng-aquila/progress-stepper';
import {PersonalDetailsStepComponent} from '../personal-details-step/personal-details-step.component';
import {PolicyPurchasePlanComponent} from '../policy-purchase-plan/policy-purchase-plan.component';
import {PolicyPurchaseSummaryComponent} from '../policy-purchase-summary/policy-purchase-summary.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PolicyPurchaseStep} from '../../models/policy.model';
import {nricValidator} from '../../validators/nric.validator';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {SubmitPolicyPurchaseStep, SubmitPolicyPurchaseSubStep} from '../../store/policy/policy-purchase.action';
import {ProgressbarComponent} from '../progress-bar/progressbar.component';
import {NxColComponent, NxLayoutComponent, NxRowComponent} from '@aposin/ng-aquila/grid';

@Component({
  selector: 'app-policy-purchase',
  imports: [
    PolicyPurchaseInitialInfoComponent,
    NxCardComponent,
    NxCardSecondaryInfoDirective,
    NxHeadlineComponent,
    NxProgressStepperComponent,
    NxStepComponent,
    PersonalDetailsStepComponent,
    PolicyPurchasePlanComponent,
    PolicyPurchaseSummaryComponent,
    ReactiveFormsModule,
    ProgressbarComponent,
    NxColComponent,
    NxLayoutComponent,
    NxRowComponent,
  ],
  templateUrl: './policy-purchase.component.html',
  styleUrl: './policy-purchase.component.scss',
})
export class PolicyPurchaseComponent implements OnInit {
  store: Store = inject(Store);
  formBuilder: FormBuilder = inject(FormBuilder);

  mainFormGroup!: FormGroup;
  personalDetailsForm!: FormGroup;

  currentStep: number = 1;
  currentSubStep: number = 1;
  currentPath: string = 'basic-information';
  currentSubPath: string = 'info-details';

  mainSteps: PolicyPurchaseStep[] = [];
  subSteps: PolicyPurchaseStep[] = [];

  initForms(): void {
    this.personalDetailsForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      fullName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      nationality: new FormControl('', Validators.required),
      idNo: new FormControl('', {
        validators: [Validators.required, nricValidator()],
      }),
      otherId: new FormControl(''),
      isUsPerson: new FormControl(false),
      countryOfBirth: new FormControl('', Validators.required),
      isSmoker: new FormControl(false),
      cigarettesPerDay: new FormControl(0),
      countryCode: new FormControl(''),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.maxLength(11),
      ]),
      occupation: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      transactionPurpose: new FormControl('', Validators.required),
    });

    this.mainFormGroup = this.formBuilder.group({
      personalDetails: this.personalDetailsForm,
    });
  }

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

  formatCamelCase(path: string): string {
    return path
      .split('-')
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  }

  ngOnInit(): void {
    this.initForms();
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
