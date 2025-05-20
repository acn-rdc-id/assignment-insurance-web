import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NxCardModule} from '@aposin/ng-aquila/card';
import {NxDropdownComponent, NxDropdownItemComponent} from '@aposin/ng-aquila/dropdown';
import {NxRadioModule} from '@aposin/ng-aquila/radio-button';
import {Observable, take} from 'rxjs';
import {Store} from '@ngxs/store';
import {PolicyPurchaseState} from '../../store/policy/policy-purchase.state';
import {PolicyDetails, PolicyPlan, PolicyPlanDto} from '../../models/policy.model';
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

  quotationDetails$!: Observable<PolicyDetails>;
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

    // this.selectedPlan$.subscribe(plan => {
    //   this.latestPlan = plan;
    // })

    this.selectedPlan$.subscribe(plan => {
      this.latestPlan = plan;
      if (plan) {
        this.infoForm.patchValue({ planSelection: plan.planName });
      }
    });

    this.quotationDetails$ = this.store.select(PolicyPurchaseState.getQuotationDetails);
  }

  onPlanSelect(plan: PolicyPlanDto) {
    const paymentPeriod = this.infoForm.value.paymentPeriod;
    
    const selectedPlan: PolicyPlan = {
      id: plan.id,
      planName: plan.planName,
      sumAssured: plan.sumAssured,
      coverageTerm: plan.coverageTerm,
      premiumAmount: paymentPeriod === 'monthly' ? plan.monthlyPremium : plan.yearlyPremium,
      premiumMode: paymentPeriod === 'monthly' ? 'MONTHLY' : 'YEARLY',
    }

    this.infoForm.patchValue({ planSelection: plan.planName });
    this.store.dispatch(new SelectPlan(selectedPlan));

  }

  onPaymentPeriodChange(newPeriod: string): void {
    this.infoForm.patchValue({ paymentPeriod: newPeriod })

    const selectedPlanName = this.infoForm.value.planSelection;
    // if (selectedPlanName) {
    //   this.plans$?.subscribe(plans => {
    //     const matchedPlan = plans.find(p => p.planName === selectedPlanName);
    //     if (matchedPlan) {
    //       this.onPlanSelect(matchedPlan);
    //     }
    //   }).unsubscribe();
    // }

      if (selectedPlanName && this.plans$) {
        this.plans$.pipe(take(1)).subscribe(plans => {
          const matchedPlan = plans.find(p => p.planName === selectedPlanName);
          if (!matchedPlan) return;

          const updatedSelectedPlan: PolicyPlan = {
            id: matchedPlan.id,
            planName: matchedPlan.planName,
            sumAssured: matchedPlan.sumAssured,
            coverageTerm: matchedPlan.coverageTerm,
            premiumAmount: newPeriod === 'monthly' ? matchedPlan.monthlyPremium : matchedPlan.yearlyPremium,
            premiumMode: newPeriod === 'monthly' ? 'MONTHLY' : 'YEARLY',
          };

          this.store.dispatch(new SelectPlan(updatedSelectedPlan));
        });
    }
  }

  onBack(): void {
    console.log('Back button clicked');
    this.prevStep();
  }

  onNext(): void {

    if (!this.infoForm.value.planSelection){
      console.warn("No plan selected");
      return;
    }
    this.nextStep();
    console.log("Proceeding with plan: ", this.infoForm.value.planSelection);

    // const selectedPlanName = this.infoForm.value.planSelection;
    // const paymentPeriod  = this.infoForm.value.paymentPeriod;

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

    // this.plans$?.pipe(take(1)).subscribe(plans => {
    //   const matchedPlan = plans.find(plan => plan.planName === selectedPlanName);
    //   if (!matchedPlan) {
    //     console.warn('Selected plan not found')
    //     return;
    //   }

    //   const selectedPlan: PolicyPlan = {
    //     id: matchedPlan.id,
    //     planName: matchedPlan.planName,
    //     sumAssured: matchedPlan.sumAssured,
    //     coverageTerm: matchedPlan.coverageTerm,
    //     premiumAmount: paymentPeriod === 'monthly' ? matchedPlan.monthlyPremium : matchedPlan.yearlyPremium,
    //     premiumMode: paymentPeriod === 'monthly' ? "MONTHLY" : "YEARLY",
    //   };
    //   this.store.dispatch(new SelectPlan(selectedPlan));
    //   this.quotationDetails = {
    //     ...this.quotationDetails,
    //     plan: selectedPlan
    //   };
    //   console.log('Dispatch selected plan', selectedPlan);
    // })
  }
}
