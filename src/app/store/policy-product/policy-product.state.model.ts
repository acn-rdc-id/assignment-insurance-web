import { PolicyDetails } from '../../models/policy.model';

export interface PolicyStateModel {
  policyList: PolicyDetails[];
}

export const POLICY_PRODUCT_STATE_DEFAULT: PolicyStateModel = {
  policyList: [
    {
      quotationNumber: '',
      plan: undefined,
      personalDetails: {
        gender: '',
        dateOfBirth: '',
        age: 0,
        title: '',
        fullName: '',
        nationality: '',
        idNo: '',
        otherId: '',
        isUsPerson: false,
        countryOfBirth: '',
        isSmoker: false,
        cigarettesPerDay: 0,
        countryCode: '',
        mobileNo: '',
        occupation: '',
        email: '',
        transactionPurpose: '',
      },
    },
  ],
};
