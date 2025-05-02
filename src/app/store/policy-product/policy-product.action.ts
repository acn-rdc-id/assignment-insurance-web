import { PolicyDetails } from '../../models/policy-product.model';

export class PolicyProductDetails {
  static readonly type = 'POLICY PRODUCT DETAILS';
  constructor(public payload: PolicyDetails[]) {}
}
