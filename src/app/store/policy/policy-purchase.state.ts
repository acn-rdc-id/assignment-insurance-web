import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable, inject } from '@angular/core';
import { SubmitInitialInfo, SelectPlan, SubmitInitialInfoSuccess,GetTermsAndConditions,SubmitPersonalDetailsInfo,SubmitPolicyPurchaseStep} from './policy-purchase.action';
import { POLICY_PURCHASE_STATE_DEFAULTS, PolicyPurchaseStateModel } from './policy-purchase.state.model';
import { PolicyService } from '../../services/policy.service';
import { map } from 'rxjs';
import {PolicyDetails, PolicyPlan, PolicyPurchaseStep} from '../../models/policy.model';

@State<PolicyPurchaseStateModel>({
  name: 'PolicyState',
  defaults: POLICY_PURCHASE_STATE_DEFAULTS
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

  @Selector()
    static getTermsAndConditions(state: PolicyPurchaseStateModel){
        return state.termsAndConditions;
    }

  @Selector()
  static getPersonalTitle(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.title || '';
  }

  @Selector()
  static getPersonalFullName(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.fullName || '';
  }

  @Selector()
  static getPersonalGender(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.gender || '';
  }

  @Selector()
  static getPersonalDateOfBirth(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.dateOfBirth || '';
  }

  @Selector()
  static getPersonalNationality(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.nationality || '';
  }

  @Selector()
  static getPersonalIdNo(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.idNo || '';
  }

  @Selector()
  static getPersonalOtherId(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.otherId || '';
  }

  @Selector()
  static getPersonalIsUsPerson(state: PolicyPurchaseStateModel): boolean {
    return state.quotationDetails.personalDetails?.isUsPerson || false;
  }

  @Selector()
  static getPersonalCountryOfBirth(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.countryOfBirth || '';
  }

  @Selector()
  static getPersonalIsSmoker(state: PolicyPurchaseStateModel): boolean {
    return state.quotationDetails.personalDetails?.isSmoker || false;
  }

  @Selector()
  static getPersonalCigarettesPerDay(state: PolicyPurchaseStateModel): number {
    return state.quotationDetails.personalDetails?.cigarettesPerDay || 0;
  }

  @Selector()
  static getPersonalCountryCode(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.countryCode || '';
  }

  @Selector()
  static getPersonalMobileNo(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.mobileNo || '';
  }

  @Selector()
  static getPersonalOccupation(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.occupation || '';
  }

  @Selector()
  static getPersonalEmail(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.email || '';
  }

  @Selector()
  static getPersonalTransactionPurpose(state: PolicyPurchaseStateModel): string {
    return state.quotationDetails.personalDetails?.transactionPurpose || '';
  }

  @Selector()
  static getCurrentMainSteps(state: PolicyPurchaseStateModel): { step: number, path: string } {
    return {
      step: state.currentMainStep?.step || 1,
      path: state.currentMainStep?.path || 'basic-information'
    };
  }

  @Selector()
  static getSteps(state: PolicyPurchaseStateModel): PolicyPurchaseStep[] {
    return state.mainStep;
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


  @Action(SubmitPersonalDetailsInfo)
  submitPersonalDetailsInfo(ctx: StateContext<PolicyPurchaseStateModel>, { payload }: SubmitPersonalDetailsInfo): void {
    const state: PolicyPurchaseStateModel = ctx.getState();
    const quotationDetails: PolicyDetails = structuredClone(state.quotationDetails || {});

    quotationDetails.personalDetails = {
      title: payload.title,
      fullName: payload.fullName,
      gender: payload.gender,
      dateOfBirth: payload.dateOfBirth,
      nationality: payload.nationality,
      idNo: payload.idNo,
      otherId: payload.otherId,
      isUsPerson: payload.isUsPerson,
      countryOfBirth: payload.countryOfBirth,
      isSmoker: payload.isSmoker,
      cigarettesPerDay: payload.cigarettesPerDay,
      countryCode: payload.countryCode,
      mobileNo: payload.mobileNo,
      occupation: payload.occupation,
      email: payload.email,
      transactionPurpose: payload.transactionPurpose
    };

    ctx.setState({
      ...state,
      quotationDetails
    });
  }

  @Action(SubmitPolicyPurchaseStep)
  setCurrentMainStep(ctx: StateContext<PolicyPurchaseStateModel>, { payload }: SubmitPolicyPurchaseStep): void {
    const state: PolicyPurchaseStateModel = ctx.getState();

    ctx.setState({
      ...state,
      currentMainStep: {
        path: payload.path,
        step: payload.step
      }
    });
  }

  @Action(GetTermsAndConditions)
  setTermsAndConditions({getState, patchState}: StateContext<GetTermsAndConditions> ){
    const state = getState();
    return patchState({ termsAndConditions: this.tableElements1 })
    // return this.policyService.getTermsConditions().pipe(
    //   map(res =>{
    //     console.log("result:: ", res)
    //     patchState(
    //       {
    //         termsAndConditions:res.data.termsAndConditions
    //     })
    //   })
    // )

  }

  tableElements1 = [{
    id: 1,
    termsHtml: `<p>Are you aware that this product pays out benefits:</p>
  <p>&emsp;(i)  Upon Death. / Selepas Kematian.</p>
  <p>&emsp;(ii) Upon Total and Permanent Disability (TPD). / Selepas Hilang Upaya Menyeluruh dan Kekal (TPD).</p>`,
  isRequired: 1

  },
  {
    id: 2,
    termsHtml: `<p>Are you aware that this product does not pay out benefits:</p>
  <p>&emsp;(i) In the event of death caused by suicide within 1 year from policy issue date.</p>
  <p>&emsp;(ii) In the event of TPD caused by attempting suicide or self-inflicted bodily injuries while sane or insane.</p>
  <p>&emsp;(iii) In the event of TPD caused by Pre-existing Conditions.</p>`,
    isRequired: 0
  },
  {
    id: 3,
    termsHtml: `<p>Are you aware that:</p>
  <p>&emsp;(i) If you change your mind, you have 15 days to return the policy from the date you receive the policy and you can obtain a refund.</p>
  <p>&emsp;(ii) You can nominate your beneficiaries in the policy servicing (you may wish to inform them about the policy to make payment of future claims easier)</p>`,
  isRequired: 1
  },
];
  
}
