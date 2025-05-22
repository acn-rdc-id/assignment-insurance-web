import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  PolicyClaimStateModel,
  POLICY_CLAIM_STATE_DEFAULTS,
} from './policy-claim.state.model';
import { inject, Injectable } from '@angular/core';
import { PolicyClaimService } from '../../services/policy-claim.service';
import {
  ClaimPolicyDocument,
  PolicyClaim,
  PolicyClaimStep,
} from '../../models/policy-claim.model';
import { map, tap } from 'rxjs';
import {
  LoadPolicyClaim,
  SetPolicyClaimSelection,
  SubmitPolicyClaimStep,
} from './policy-claim.action';

@State<PolicyClaimStateModel>({
  name: 'PolicyClaimState',
  defaults: POLICY_CLAIM_STATE_DEFAULTS,
})
@Injectable()
export class PolicyClaimState {
  private policyClaimService: PolicyClaimService = inject(PolicyClaimService);

  @Selector()
  static getPolicyClaimList(state: PolicyClaimStateModel): PolicyClaim {
    return structuredClone(state.policyClaim);
  }

  @Selector()
  static getSelectedPolicyId(state: PolicyClaimStateModel): string {
    return structuredClone(state.selectedPolicyId);
  }

  @Selector()
  static getSelectedTypeOfClaim(
    state: PolicyClaimStateModel
  ): ClaimPolicyDocument {
    return structuredClone(state.selectedTypeOfClaim);
  }

  @Selector()
  static getMainSteps(state: PolicyClaimStateModel): PolicyClaimStep[] {
    return state.mainSteps;
  }

  @Action(LoadPolicyClaim)
  loadAllPolicies(ctx: StateContext<PolicyClaimStateModel>) {
    const state = ctx.getState();
    return this.policyClaimService.getPolicyClaimDoc().pipe(
      map((res) => {
        ctx.setState({
          ...state,
          policyClaim: {
            policyId: res.data.policyId,
            claimPolicyDocument: res.data.claimPolicyDocument,
          },
          mainSteps: [
            { path: 'claim-selection', step: 1 },
            { path: 'claim-upload', step: 2 },
          ],
        });
      })
    );
  }

  @Action(SetPolicyClaimSelection)
  setSelectedPolicyClaim(
    ctx: StateContext<PolicyClaimStateModel>,
    { payload }: SetPolicyClaimSelection
  ) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      selectedPolicyId: payload.policyId,
      selectedTypeOfClaim: payload.typeOfClaim,
    });
  }

  @Action(SubmitPolicyClaimStep)
  setCurrentMainStep(
    ctx: StateContext<PolicyClaimStateModel>,
    { payload }: SubmitPolicyClaimStep
  ): void {
    const state: PolicyClaimStateModel = ctx.getState();

    ctx.setState({
      ...state,
      currentMainStep: {
        path: payload.path,
        step: payload.step,
      },
    });
  }
}
