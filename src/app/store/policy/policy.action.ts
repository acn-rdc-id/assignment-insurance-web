import { PolicyPlan } from '../../models/policy.model';

export class SubmitInitialInfo {
  static readonly type = '[Policy] Submit Initial Info';
  constructor(public payload: { gender: string; dateOfBirth: string }) {}
}

export class SelectPlan {
  static readonly type = '[Policy] Select Plan';
  constructor(public payload: PolicyPlan) {}
}

export class SubmitInitialInfoSuccess {
  static readonly type = '[Policy] Submit Initial Info Success';
  constructor(public payload: any) {}
}
