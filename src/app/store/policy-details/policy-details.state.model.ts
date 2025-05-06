import { PolicyDetails } from "../../models/policy.model";
  
export interface PolicyDetailsStateModel {
    policyDetails: PolicyDetails
}

export const POLICY_DETAILS_STATE_DEFAULTS: PolicyDetailsStateModel = {
    policyDetails: {
        quotationNumber: '',
        gender: '',
        dateOfBirth: '',
        age: 0,
        plan: undefined
    }
}