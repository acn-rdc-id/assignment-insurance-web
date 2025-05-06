import {Action, Selector, State, StateContext} from '@ngxs/store';
import {inject, Injectable} from '@angular/core';
import {
  SelectPlan,
  SubmitInitialInfo,
  SubmitInitialInfoSuccess,
  SubmitPersonalDetailsInfo,
  SubmitPolicyPurchaseStep
} from './policy-purchase.action';
import {POLICY_PURCHASE_STATE_DEFAULTS, PolicyPurchaseStateModel} from './policy-purchase.state.model';
import {PolicyService} from '../../services/policy.service';
import {map} from 'rxjs';
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
}
