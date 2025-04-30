import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxDropdownComponent, NxDropdownItemComponent } from '@aposin/ng-aquila/dropdown';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { PolicyPurchaseState } from '../../store/policy/policy-purchase.state';
import { PolicyPlan, PolicyPlanDto } from '../../models/policy.model';
import { SelectPlan } from '../../store/policy/policy-purchase.action';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy-purchase-plan',
  imports: [
    FormsModule, 
    NxCardModule, 
    NxDropdownComponent, 
    NxDropdownItemComponent,
    NxRadioModule,
    ReactiveFormsModule, 
    CommonModule
  ],
  templateUrl: './policy-purchase-plan.component.html',
  styleUrl: './policy-purchase-plan.component.scss',
  standalone: true,
})

export class PolicyPurchasePlanComponent implements OnInit {
  plans$: Observable<PolicyPlanDto[]> | undefined;
  selectedPlan$: Observable<PolicyPlan | undefined> | undefined;

  infoForm!: FormGroup;
  selectedPlan: any; 

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.infoForm = this.fb.group({
      paymentPeriod: ['monthly'],
      planSelection: ['']
    });

    this.plans$ = this.store.select(PolicyPurchaseState.plans);
    this.selectedPlan$ = this.store.select(PolicyPurchaseState.selectedPlan);
  }

  onPlanSelect(plan: PolicyPlanDto) {
    this.infoForm.patchValue({ planSelection: plan.planName });
    this.store.dispatch(new SelectPlan(plan));
  }
  
  onPaymentPeriodChange(newPeriod: string) {
    this.infoForm.patchValue({ paymentPeriod: newPeriod })
  }

  onNext(): void {
    if (!this.infoForm.value.planSelection){
      console.warn("No plan selected");
      return;
    }
    console.log("Proceeding with plan: ", this.infoForm.value.planSelection);
    this.router.navigate(['/policy-purchase-initial-info']);
  }
}
