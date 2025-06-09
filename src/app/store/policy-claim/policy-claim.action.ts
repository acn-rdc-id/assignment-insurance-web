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

export class GetClaimList {
  static readonly type = '[POLICY CLAIM] GET CLAIM LIST';
  constructor() {}
}

export class GetClaimDetails {
  static readonly type = '[POLICY CLAIM] GET CLAIM DETAILS';
  constructor(public claimId: number) {}
}

export class PostSubmitClaim {
  static readonly type = '[POLICY CLAIM] POST SUBMIT CLAIM';
  constructor(public payload: any) {}
}

export class DownloadDocument {
  static readonly type = '[POLICY CLAIM] DOWNLOAD DOCUMENT';
  constructor(public payload: any) {}
}

export class ClearPolicySubmission {
  static readonly type = '[POLICY CLAIM] CLEAR POLICY SELECTION DETAILS';
  constructor() {}
}
