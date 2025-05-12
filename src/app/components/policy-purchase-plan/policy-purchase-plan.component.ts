import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NxCardModule} from '@aposin/ng-aquila/card';
import {NxDropdownComponent, NxDropdownItemComponent} from '@aposin/ng-aquila/dropdown';
import {NxRadioModule} from '@aposin/ng-aquila/radio-button';
import {Observable, take} from 'rxjs';
import {Store} from '@ngxs/store';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {PolicyPlan, PolicyPlanDto} from '../../models/policy.model';
import {SelectPlan} from '../../store/policy/policy-purchase.action';
import {CommonModule} from '@angular/common';
import {NxButtonComponent} from '@aposin/ng-aquila/button';
import { QuotationSummaryComponent } from '../quotation-summary/quotation-summary.component';

@Component({
  selector: 'app-policy-purchase-plan',
  imports: [
    FormsModule,
    NxCardModule,
    NxDropdownComponent,
    NxDropdownItemComponent,
    NxRadioModule,
    ReactiveFormsModule,
    CommonModule,
    NxButtonComponent,
    NxButtonComponent,
    QuotationSummaryComponent
  ],
  templateUrl: './policy-purchase-plan.component.html',
  styleUrl: './policy-purchase-plan.component.scss',
  standalone: true,
})

export class PolicyPurchasePlanComponent implements OnInit {
  @Input() nextStep!: () => void;
  @Input() prevStep!: () => void;

  plans$: Observable<PolicyPlanDto[]> | undefined;
  selectedPlan$: Observable<PolicyPlan | undefined> | undefined;

  infoForm!: FormGroup;
  selectedPlan: any;
  latestPlan!: PolicyPlan | undefined;

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      paymentPeriod: ['monthly'],
      planSelection: ['']
    });

    this.plans$ = this.store.select(PolicyPurchaseState.plans);
    this.selectedPlan$ = this.store.select(PolicyPurchaseState.selectedPlan);

    this.selectedPlan$.subscribe(plan => {
      this.latestPlan = plan;
    })
  }

  // onPlanSelect(plan: PolicyPlanDto) {
  //   const paymentPeriod = this.infoForm.value.paymentPeriod;
  //   const premiumAmount = paymentPeriod === 'monthly' ? plan.monthlyPremium : plan.yearlyPremium;

  //   const selectedPlan: PolicyPlan = {
  //     planName: plan.planName,
  //     sumAssured: plan.sumAssured,
  //     coverageTerm: plan.coverageTerm,
  //     premiumAmount: premiumAmount,
  //     paymentPeriod: paymentPeriod
  //   }

  //   this.infoForm.patchValue({ planSelection: plan.planName });
  //   console.log('Dispatching selected plans: ', selectedPlan);
  //   this.store.dispatch(new SelectPlan(selectedPlan));
  // }

  onPaymentPeriodChange(newPeriod: string) {
    this.infoForm.patchValue({ paymentPeriod: newPeriod })
  }

  onBack(): void {
    console.log('Back button clicked');
    this.prevStep();
  }

  onNext(): void {
    this.nextStep();
    if (!this.infoForm.value.planSelection){
      console.warn("No plan selected");
      return;
    }
    console.log("Proceeding with plan: ", this.infoForm.value.planSelection);

    const selectedPlanName = this.infoForm.value.planSelection;
    const paymentPeriod  = this.infoForm.value.paymentPeriod;

    // if (!selectedPlanName || !paymentPeriod) {
    //   console.warn('Plan or payment period not selected!')
    //   return;
    // }

    // const selectedPlan = this.latestPlan.find(plan => plan.planName === selectedPlanName);

    // if(selectedPlan) {
    //   const fullPlan: PolicyPlan {
    //     planName: selectedPlan.planName,
    //     sumAssured: selectedPlan.sumAssured,
    //     coverageTerm: selectedPlan.coverageTerm,
    //     premiumAmount: paymentPeriod === 'monthly' ? selectedPlan.monthlyPremium : selectedPlan.yearlyPremium,
    //     paymentPeriod: paymentPeriod,
    //   };

    //   this.store.dispatch(new SelectPlan(fullPlan))
    // }

    this.plans$?.pipe(take(1)).subscribe(plans => {
      const matchedPlan = plans.find(plan => plan.planName === selectedPlanName);
      if (!matchedPlan) {
        console.warn('Selected plan not found')
        return;
      }

      const selectedPlan: PolicyPlan = {
        id: matchedPlan.id,
        planName: matchedPlan.planName,
        sumAssured: matchedPlan.sumAssured,
        coverageTerm: matchedPlan.coverageTerm,
        premiumAmount: paymentPeriod === 'monthly' ? matchedPlan.monthlyPremium : matchedPlan.yearlyPremium,
        premiumMode: paymentPeriod === 'monthly' ? "MONTHLY" : "YEARLY",
      };

      this.store.dispatch(new SelectPlan(selectedPlan));
      console.log('Dispatch selected plan', selectedPlan);
    })
  }

  // onPlanSelect(plan: PolicyPlanDto) {
  //   const paymentPeriod = this.infoForm.value.paymentPeriod;
  //   const premiumAmount = paymentPeriod === 'monthly' ? plan.monthlyPremium : plan.yearlyPremium;

  //   const selectedPlan: PolicyPlan = {
  //     planName: plan.planName,
  //     sumAssured: plan.sumAssured,
  //     coverageTerm: plan.coverageTerm,
  //     premiumAmount: premiumAmount,
  //     paymentPeriod: paymentPeriod
  //   }

  //   this.infoForm.patchValue({ planSelection: plan.planName });
  //   console.log('Dispatching selected plans: ', selectedPlan);
  //   this.store.dispatch(new SelectPlan(selectedPlan));
  // }
}
