import { PolicyClaimStep } from '../../models/policy-claim.model';

export class LoadPolicyClaim {
  static readonly type = '[POLICY CLAIM] LOAD ALL POLICIES CLAIMS';
  constructor() {}
}

export class SubmitPolicyClaimStep {
  static readonly type = '[POLICY CLAIM] Submit Inital Policy Claim Step';
  constructor(public payload: PolicyClaimStep) {}
}

export class SetPolicyClaimSelection {
  static readonly type = '[POLICY CLAIM] SET SELECTED POLICY CLAIM SELECTION';
  constructor(public payload: any) {}
}

export class getClaimList {
  static readonly type = '[Claim] Get ClaimList';
  constructor() {}
}

export class PostSubmitClaim {
  static readonly type = '[POLICY CLAIM] POST SUBMIT CLAIM';
  constructor(public payload: any) {}
}
