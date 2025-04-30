import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { SubmitInitialInfo, SelectPlan, SubmitInitialInfoSuccess } from './policy.action';
import { PolicyStateModel } from './policy.state.model';
import { PolicyService } from '../../services/policy.service';
import { map } from 'rxjs';

@State<PolicyStateModel>({
  name: 'policy',
  defaults: {
    referenceNumber: '',
    gender: '',
    dateOfBirth: '',
    ageNearestBirthday: 0,
    plans: [],
    selectedPlan: null
  }
})

@Injectable()
export class PolicyState {
  private policyService = inject(PolicyService);

  @Selector()
  static getGender(state: PolicyStateModel): string {
    return state.gender;
  }

  @Selector()
  static getDateOfBirth(state: PolicyStateModel): string {
    return state.dateOfBirth;
  }

  @Selector()
  static getReferenceNumber(state: PolicyStateModel): string {
    return state.referenceNumber;
  }
  
  @Selector()
  static plans(state: PolicyStateModel) {
    return state.plans;
  }

  @Selector()
  static selectedPlan(state: PolicyStateModel) {
    return state.selectedPlan;
  }

  @Action(SubmitInitialInfo)
  submitInitialInfo(ctx: StateContext<PolicyStateModel>, { payload }: SubmitInitialInfo) {
    return this.policyService.getPlans(payload).pipe(
      map(response => {
        ctx.setState({
          ...response,
          selectedPlan: null
        });
      })
    );
  }

  @Action(SubmitInitialInfoSuccess)
  submitInitialInfoSuccess(ctx: StateContext<PolicyStateModel>, action: SubmitInitialInfoSuccess) {
    const { payload } = action;
    ctx.patchState({
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth,
      referenceNumber: payload.referenceNumber,
      ageNearestBirthday: payload.ageNearestBirthday,
      plans: payload.plans
    });
  }

  @Action(SelectPlan)
  selectPlan(ctx: StateContext<PolicyStateModel>, { payload }: SelectPlan) {
    ctx.patchState({ selectedPlan: payload });
  }
}
