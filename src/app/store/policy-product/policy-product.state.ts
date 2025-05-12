import {Action, Selector, State, StateContext} from '@ngxs/store';
import {POLICY_PRODUCT_STATE_DEFAULT, PolicyStateModel,} from './policy-product.state.model';
import {Injectable} from '@angular/core';
import {PolicyDetails} from '../../models/policy.model';
import {PolicyProductDetails} from './policy-product.action';

@State<PolicyStateModel>({
  name: 'PolicyProductState',
  defaults: POLICY_PRODUCT_STATE_DEFAULT,
})
@Injectable()
export class PolicyProductState {
  @Selector()
  static getPolicyDetailsList(state: PolicyStateModel): PolicyDetails[] {
    return structuredClone(state.policyList);
  }

  @Action(PolicyProductDetails)
  policyDetailsList(ctx: StateContext<PolicyStateModel>, { payload }: PolicyProductDetails): void {
    const state: PolicyStateModel = ctx.getState();

    const transformedPolicies: PolicyDetails[] = payload.map((item: any) => ({
      quotationNumber: item.policyNo,
      plan: {
        id: item.applicationResponseDto.planResponseDto.id,
        planName: item.applicationResponseDto.planResponseDto.planName,
        sumAssured: item.applicationResponseDto.planResponseDto.sumAssured,
        coverageTerm: item.applicationResponseDto.planResponseDto.coverageTerm,
        premiumAmount: item.applicationResponseDto.planResponseDto.premiumAmount,
        premiumMode: item.applicationResponseDto.planResponseDto.premiumMode,
        referenceNumber: item.applicationResponseDto.planResponseDto.referenceNumber,
        endDate: item.endDate,
        startDate: item.startDate,
        status: item.status,
        policyNo: item.policyNo,
        policyId: item.id,
      },
      personalDetails: {
        fullName: item.applicationResponseDto.fullName,
        gender: item.applicationResponseDto.gender,
        nationality: item.applicationResponseDto.nationality,
        identificationNo: item.applicationResponseDto.identificationNo,
        countryOfBirth: item.applicationResponseDto.countryOfBirth,
        phoneNo: item.applicationResponseDto.phoneNo,
        email: item.applicationResponseDto.email,
        dateOfBirth: item.applicationResponseDto.dateOfBirth,
        isSmoker: item.applicationResponseDto.isSmoker,
        cigarettesNo: item.applicationResponseDto.cigarettesNo,
        occupation: item.applicationResponseDto.occupation,
        purposeOfTransaction: item.applicationResponseDto.purposeOfTransaction,
      }
    }));

    ctx.setState({
      ...state,
      policyList: transformedPolicies
    });
  }
}
