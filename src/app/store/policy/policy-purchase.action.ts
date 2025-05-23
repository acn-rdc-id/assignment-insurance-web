import {PolicyPersonalDetails, PolicyPlan, PolicyPurchaseStep} from '../../models/policy.model';

export class SelectPlan {
  static readonly type = '[Policy] Select Plan';
  constructor(public payload: PolicyPlan) {}
}

export class SubmitInitialInfoSuccess {
  static readonly type = '[Policy] Submit Initial Info Success';
  constructor(public payload: any) {}
}

export class GetTermsAndConditions {
  static readonly type = '[POLICY] GET TERMS AND CONDITIONS';
  constructor() {}
}

export class PostQuotationPlans {
  static readonly type = '[POLICY] POST QUOTATION PLANS';
  constructor(public payload: any) {}
}

export class PostPolicyApplication {
  static readonly type = '[POLICY] POST POLICY APPLICATION';
  constructor(public payload: any) {}
}

export class PostPayment {
  static readonly type = '[POLICY] POST PAYMENT';
  constructor(public payload: any) {}
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

export class getClaimList {
  static readonly type = '[Claim] Get ClaimList';
  constructor() {}
}

