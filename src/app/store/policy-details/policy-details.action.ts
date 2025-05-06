import { TermsConditions } from '../../models/policy.model';

export class GetPolicyDetails {
  static readonly type = 'Get PolicyDetails';
  constructor(public payload: {id: string}) {}
}
