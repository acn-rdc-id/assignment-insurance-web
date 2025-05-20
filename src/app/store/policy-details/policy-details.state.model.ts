import {PolicyDetails} from "../../models/policy.model";

export interface PolicyDetailsStateModel {
    policyDetails: PolicyDetails,
    policyBeneficiaries?: any;
}

export const POLICY_DETAILS_STATE_DEFAULTS: PolicyDetailsStateModel = {
    policyDetails: {
        quotationNumber: '',
        plan: undefined,
        personalDetails: undefined
    }
}
