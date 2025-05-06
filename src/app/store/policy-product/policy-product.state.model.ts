import { PolicyDetails } from '../../models/policy.model';

export interface PolicyStateModel {
  policyList: PolicyDetails;
}

export const POLICY_PRODUCT_STATE_DEFAULT: PolicyStateModel = {
  policyList: {
    quotationNumber: '',
    gender: '',
    dateOfBirth: '',
    age: 0,
    plan: {
      planName: '',
      sumAssured: 0,
      coverageTerm: '',
      premiumAmount: 0,
      paymentPeriod: '',
    },
  },
};
