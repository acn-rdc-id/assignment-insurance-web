import {Action, Selector, State, StateContext} from '@ngxs/store';
import {POLICY_PRODUCT_STATE_DEFAULT, PolicyStateModel,} from './policy-product.state.model';
import {inject, Injectable} from '@angular/core';
import {PolicyBeneficiary, PolicyDetails} from '../../models/policy.model';
import {GetPolicyDetails, LoadAllPolicies, PostListBeneficiaries, UpdateInsuredInfo} from './policy-product.action';
import {PolicyProductService} from '../../services/policy-product.service';
import {map, tap} from 'rxjs';
import {HttpResponseBody} from '../../models/http-body.model';

@State<PolicyStateModel>({
  name: 'PolicyProductState',
  defaults: POLICY_PRODUCT_STATE_DEFAULT,
})
@Injectable()
export class PolicyProductState {
  private policyProductService:PolicyProductService =  inject(PolicyProductService);

  @Selector()
  static getPolicyDetailsList(state: PolicyStateModel): PolicyDetails[] {
    return structuredClone(state.policyList);
  }

  @Selector()
  static getPolicyDetails(state: PolicyStateModel): PolicyDetails {
    return structuredClone(state.policyDetails);
  }

  @Selector()
  static getPolicyBeneficiaries(state: PolicyStateModel): Array<PolicyBeneficiary> {
    if (state.policyDetails.beneficiariesList)
      return structuredClone(state.policyDetails.beneficiariesList);
    return [];
  }

  @Action(LoadAllPolicies)
  loadAllPolicies(ctx: StateContext<PolicyStateModel>) {
    const state: PolicyStateModel = ctx.getState();
    return this.policyProductService.getAllPolicies().pipe(
      tap((response: HttpResponseBody) => {
        const transformedPolicies: PolicyDetails[] = response.data.map((item: any) => ({
          policyId: item?.id,
          quotationNumber: item.policyNo,
          plan: {
            id: item.applicationResponseDto.planResponseDto.id,
            planName: item.applicationResponseDto.planResponseDto.planName,
            sumAssured: item.applicationResponseDto.planResponseDto.sumAssured,
            coverageTerm: item.applicationResponseDto.planResponseDto.coverageTerm,
            premiumAmount: item.applicationResponseDto.planResponseDto.premiumAmount,
            premiumMode: item.applicationResponseDto.planResponseDto.premiumMode,
            referenceNumber: item.applicationResponseDto.planResponseDto.referenceNumber
          },
          personalDetails: {
            policyId: item.id,
            fullName: item.applicationResponseDto.fullName,
            gender: item.applicationResponseDto.gender,
            nationality: item.applicationResponseDto.nationality,
            idNo: item.applicationResponseDto.identificationNo,
            countryOfBirth: item.applicationResponseDto.countryOfBirth,
            mobileNo: item.applicationResponseDto.phoneNo,
            email: item.applicationResponseDto.email,
            dateOfBirth: item.applicationResponseDto.dateOfBirth,
            isSmoker: item.applicationResponseDto.isSmoker,
            cigarettesNo: item.applicationResponseDto.cigarettesNo,
            occupation: item.applicationResponseDto.occupation,
            purposeOfTransaction: item.applicationResponseDto.purposeOfTransaction,
            title: item.applicationResponseDto.title,
            countryCode: item.applicationResponseDto.countryCode
          },
          beneficiariesList: item.beneficiaryList,
          endDate: item.endDate,
          startDate: item.startDate,
          status: item.status
        }));

        ctx.setState({
          ...state,
          policyList: transformedPolicies,
        });
      }),
      map((response: HttpResponseBody) => response.message)
    );
  }

  @Action(PostListBeneficiaries)
  postListBeneficiaries(ctx: StateContext<PolicyStateModel>, { payload }: PostListBeneficiaries) {
    const state = ctx.getState();
    return this.policyProductService.postListBeneficiaries(payload).pipe(
      map((response: HttpResponseBody) => {
        let curPolicyDetails: PolicyDetails = state.policyDetails;
        curPolicyDetails.beneficiariesList = response.data?.beneficiaries ?? [];
        ctx.patchState({
          policyDetails: curPolicyDetails
        });
        return {
          message: response.message
        };
      })
    );
  }

  @Action(UpdateInsuredInfo)
  updateInsuredInfo(ctx: StateContext<PolicyStateModel>, action: UpdateInsuredInfo) {
    const { policyId, updatedInfo } = action;
    const state = ctx.getState();

    return this.policyProductService.updateInsuredInfo(policyId, updatedInfo).pipe(
      tap((response: HttpResponseBody) => {
        if (response.status === 'Success' && response.code === 200) {
          const updatedPolicies = state.policyList.map(policy => 
            policy.personalDetails?.policyId === policyId
            ? {
              ...policy,
              personalDetails : {
                ...policy.personalDetails,
                ...updatedInfo
              }
            }
            : policy
          );

          ctx.patchState({
            ...state,
            policyList: updatedPolicies
          });
        } else {
          console.warn('Update failed on backend')
        }
      })
    );
    // const updatedPolicies = state.policyList.map(policy =>
    //   policy.quotationNumber === policyNo
    //     ? {
    //         ...policy,
    //         personalDetails: {
    //           ...policy.personalDetails,
    //           ...updatedInfo
    //         }
    //       }
    //     : policy
    // );

    // ctx.patchState({
    //   ...state,
    //   policyList: updatedPolicies
    // });
  }

  @Action(GetPolicyDetails)
  getPolicyDetails({ patchState }: StateContext<PolicyStateModel>, { policyId }: GetPolicyDetails) {
    return this.policyProductService.getPolicyDetails(policyId).pipe(
      map((response: HttpResponseBody) => {
        const item = response.data;
        const policyDetails: PolicyDetails = {
          policyId: item?.id,
          quotationNumber: item?.policyNo,
          plan: {
            id: item?.applicationResponseDto.planResponseDto.id,
            planName: item?.applicationResponseDto.planResponseDto.planName,
            sumAssured: item?.applicationResponseDto.planResponseDto.sumAssured,
            coverageTerm: item?.applicationResponseDto.planResponseDto.coverageTerm,
            premiumAmount: item?.applicationResponseDto.planResponseDto.premiumAmount,
            premiumMode: item?.applicationResponseDto.planResponseDto.premiumMode,
            referenceNumber: item.applicationResponseDto.planResponseDto.referenceNumber
          },
          personalDetails: {
            policyId: item.id,
            fullName: item.applicationResponseDto.fullName,
            gender: item.applicationResponseDto.gender,
            nationality: item.applicationResponseDto.nationality,
            idNo: item.applicationResponseDto.identificationNo,
            countryOfBirth: item.applicationResponseDto.countryOfBirth,
            mobileNo: item.applicationResponseDto.phoneNo,
            email: item.applicationResponseDto.email,
            dateOfBirth: item.applicationResponseDto.dateOfBirth,
            isSmoker: item.applicationResponseDto.isSmoker,
            cigarettesNo: item.applicationResponseDto.cigarettesNo,
            occupation: item.applicationResponseDto.occupation,
            purposeOfTransaction: item.applicationResponseDto.purposeOfTransaction,
            title: item.applicationResponseDto.title,
            countryCode: item.applicationResponseDto.countryCode
          },
          beneficiariesList: item.beneficiaryList,
          startDate: item.startDate,
          endDate: item.endDate,
          status: item.status          
        }
        patchState({
          policyDetails: policyDetails
        })
      })
    );
  }
}
