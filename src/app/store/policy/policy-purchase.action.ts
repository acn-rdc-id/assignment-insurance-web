import {PolicyPersonalDetails, PolicyPlanDto, PolicyPurchaseStep} from '../../models/policy.model';

export class SubmitInitialInfo {
  static readonly type = '[Policy] Submit Initial Info';
  constructor(public payload: { gender: string; dateOfBirth: string }) {}
}

export class SelectPlan {
  static readonly type = '[Policy] Select Plan';
  constructor(public payload: PolicyPlanDto) {}
}

export class SubmitInitialInfoSuccess {
  static readonly type = '[Policy] Submit Initial Info Success';
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
