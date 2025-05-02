import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { SubmitInitialInfo, SelectPlan, SubmitInitialInfoSuccess } from './policy-purchase.action';
import { PolicyPurchaseStateModel } from './policy-purchase.state.model';
import { PolicyService } from '../../services/policy.service';
import { map } from 'rxjs';
import { POLICY_DETAILS_DEFAULT, PolicyPlan } from '../../models/policy.model';

@State<PolicyPurchaseStateModel>({
  name: 'policy',
  defaults: {
    quotationDetails: POLICY_DETAILS_DEFAULT,
    plans: []
  }
})

@Injectable()
export class PolicyPurchaseState {
  private policyService = inject(PolicyService);

  @Selector()
  static getGender(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.gender;
  }

  @Selector()
  static getDateOfBirth(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.dateOfBirth;
  }

  @Selector()
  static getReferenceNumber(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.quotationNumber;
  }
  
  @Selector()
  static plans(state: PolicyPurchaseStateModel) {
    return state.plans;
  }

  @Selector()
  static selectedPlan(state: PolicyPurchaseStateModel) {
    return state.quotationDetails.plan;
  }

  @Action(SubmitInitialInfo)
  submitInitialInfo(ctx: StateContext<PolicyPurchaseStateModel>, { payload }: SubmitInitialInfo) {
    return this.policyService.getPlans(payload).pipe(
      map(response => {
        // ctx.setState({
        //   ...response,
        // });
      })
    );
  }

  @Action(SubmitInitialInfoSuccess)
  submitInitialInfoSuccess(ctx: StateContext<PolicyPurchaseStateModel>, {payload}: SubmitInitialInfoSuccess) {
    let quotationDetails = structuredClone(ctx.getState().quotationDetails);
    quotationDetails.gender = payload.gender;
    quotationDetails.dateOfBirth = payload.dateOfBirth;
    quotationDetails.quotationNumber = payload.referenceNumber;
    quotationDetails.age = payload.ageNearestBirthday,

    ctx.patchState({
      quotationDetails: quotationDetails,
      plans: payload.plans
    });
  }

  @Action(SelectPlan)
  selectPlan(ctx: StateContext<PolicyPurchaseStateModel>, { payload }: SelectPlan) {
    let quotationDetails = structuredClone(ctx.getState().quotationDetails);
    const selectedPlan: PolicyPlan = {
      coverageTerm: payload.coverageTerm,
      paymentPeriod: 'monthly',
      planName: payload.planName,
      premiumAmount: 4000,
      sumAssured: payload.sumAssured
    }
    quotationDetails.plan = selectedPlan;
    ctx.patchState({ quotationDetails: quotationDetails,  });
  }
}
