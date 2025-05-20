export class LoadAllPolicies {
  static readonly type = '[POLICY] LOAD ALL POLICIES';
  constructor() {};
}

export class PostListBeneficiaries {
  static readonly type = '[POLICY SERVICING] POST LIST BENEFICIARIES';
  constructor(public payload: any) {}
}
