import {Action, Selector, State, StateContext} from '@ngxs/store';
import {POLICY_CLAIM_STATE_DEFAULTS, PolicyClaimStateModel,} from './policy-claim.state.model';
import {inject, Injectable} from '@angular/core';
import {PolicyClaimService} from '../../services/policy-claim.service';
import {ClaimPolicyDocument, PolicyClaim, PolicyClaimStep,} from '../../models/policy-claim.model';
import {map, tap} from 'rxjs';
import {
  getClaimList,
  LoadPolicyClaim,
  PostSubmitClaim,
  SetPolicyClaimSelection,
  SubmitPolicyClaimStep,
} from './policy-claim.action';
import {HttpResponseBody} from '../../models/http-body.model';
import {Claims} from '../../models/claim.model';

@State<PolicyClaimStateModel>({
  name: 'PolicyClaimState',
  defaults: POLICY_CLAIM_STATE_DEFAULTS,
})
@Injectable()
export class PolicyClaimState {
  private policyClaimService: PolicyClaimService = inject(PolicyClaimService);

  @Selector()
    static getClaimList(state: PolicyClaimStateModel): Claims  {
      return state.claimList;
  }

  @Selector()
  static getPolicyClaimList(state: PolicyClaimStateModel): PolicyClaim {
    return structuredClone(state.policyClaim);
  }

  @Selector()
  static getSelectedPolicyId(state: PolicyClaimStateModel): number {
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
    const state: PolicyClaimStateModel = ctx.getState();
    return this.policyClaimService.getPolicyClaimDoc().pipe(
      map((res: HttpResponseBody) => {
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

    @Action(getClaimList)
      getClaimList(ctx: StateContext<PolicyClaimStateModel>) {
        return this.policyClaimService.getClaimList().pipe(
          tap((response: HttpResponseBody) => {
            const state: PolicyClaimStateModel = ctx.getState();
            const transformedClaims: Claims = response.data.map((item: any) => ({
              claimId: item.claimId,
              policyId: item.policyId,
              claim_date: item.claim_date,
              claimStatus: item.claimStatus,
              claimType: item.claimType,
              claimdetails: undefined,
              claimdocuments: undefined,}))
            ctx.setState({
              ...state,
              claimList: transformedClaims || []
            });
          }),
          map((response: HttpResponseBody) => response.message)
        );
      }

  @Action(PostSubmitClaim)
  postSubmitClaim(ctx: StateContext<PolicyClaimStateModel>, {payload}: PostSubmitClaim) {
    return this.policyClaimService.postSubmitClaim(payload).pipe(
      map((response: HttpResponseBody) => {
        return {
          message: response.message
        };
      })
    );
  }
}
