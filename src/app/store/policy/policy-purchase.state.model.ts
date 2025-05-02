import { PolicyDetails, PolicyPlanDto } from "../../models/policy.model";
  
export interface PolicyPurchaseStateModel {
    quotationDetails: PolicyDetails
    plans: PolicyPlanDto[];
}

export const POLICY_PURCHASE_STATE_DEFAULTS: PolicyPurchaseStateModel = {
    quotationDetails: {
        quotationNumber: '',
        gender: '',
        dateOfBirth: '',
        age: 0,
        plan: undefined
    },
    plans: []
}