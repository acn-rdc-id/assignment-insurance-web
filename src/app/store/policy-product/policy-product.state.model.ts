import {POLICY_DETAILS_DEFAULT, PolicyDetails} from '../../models/policy.model';

export interface PolicyStateModel {
  policyList: Array<PolicyDetails>;
  policyDetails: PolicyDetails;
}

export const POLICY_PRODUCT_STATE_DEFAULT: PolicyStateModel = {
  policyList: [],
  policyDetails: POLICY_DETAILS_DEFAULT
};