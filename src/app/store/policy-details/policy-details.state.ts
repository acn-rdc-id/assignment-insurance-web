import {Action, Selector, State, StateContext} from '@ngxs/store';
import {inject, Injectable} from '@angular/core';
import {GetPolicyDetails} from './policy-details.action';
import {POLICY_DETAILS_STATE_DEFAULTS, PolicyDetailsStateModel} from './policy-details.state.model';
import {PolicyService} from '../../services/policy.service';
import {map} from 'rxjs';

@State<PolicyDetailsStateModel>({
  name: 'PolicyDetailsState',
  defaults: POLICY_DETAILS_STATE_DEFAULTS
})

@Injectable()
export class PolicyDetailsState {
  private policyService = inject(PolicyService);

  @Selector()
  static getPolicyDetails(state: PolicyDetailsStateModel) {
    return state.policyDetails;
  }

  @Action(GetPolicyDetails)
  setPolicyDetails({getState, setState}: StateContext<PolicyDetailsStateModel>, {payload}:GetPolicyDetails){
    const state = getState();
    return this.policyService.fetchPolicyDetails(payload).pipe(
      map(res=>{
        setState({
          policyDetails:res.data.policyDetails
        })
      })
    )
  }
}
