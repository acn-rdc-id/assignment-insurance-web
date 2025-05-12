import {PolicyPersonalDetails, PolicyPlan, PolicyPlanDto, TermsConditions, PolicyPurchaseStep} from '../../models/policy.model';

export class SubmitInitialInfo {
  static readonly type = '[Policy] Submit Initial Info';
  constructor(public payload: any) {}
}

export class SelectPlan {
  static readonly type = '[Policy] Select Plan';
  constructor(public payload: PolicyPlan) {}
}

export class SubmitInitialInfoSuccess {
  static readonly type = '[Policy] Submit Initial Info Success';
  constructor(public payload: any) {}
}

export class GetTermsAndConditions {
  static readonly type = 'Get Terms And Conditions';
  constructor(public payload: TermsConditions[]) {}
}

export class SubmitPersonalDetailsInfo {
  static readonly type = '[Policy] Submit Personal Details Info';
  constructor(public payload: PolicyPersonalDetails) {}
}

export class SubmitPolicyPurchaseStep {
  static readonly type = '[Policy] Submit Inital Policy Purchase Step';
  constructor(public payload: PolicyPurchaseStep) {}
}

export class SubmitPolicyPurchaseSubStep {
  static readonly type = '[Policy] Submit Inital Policy Purchase Sub Step';
  constructor(public payload: PolicyPurchaseStep) {}
}
