import {PolicyDetails, PolicyPlanDto, TermsConditions, PolicyPurchaseStep} from "../../models/policy.model";

export interface PolicyPurchaseStateModel {
    mainStep: PolicyPurchaseStep[];
    currentMainStep: PolicyPurchaseStep;
    quotationDetails: PolicyDetails
    plans: PolicyPlanDto[];
    termsAndConditions: TermsConditions[]
}

export const POLICY_PURCHASE_STATE_DEFAULTS: PolicyPurchaseStateModel = {
    quotationDetails: {
        quotationNumber: '',
        gender: '',
        dateOfBirth: '',
        age: 0,
        plan: undefined,
        personalDetails: undefined,
    },
    plans: [],
    termsAndConditions: [],
    mainStep: [
      { path: 'basic-information', step: 1 },
      { path: 'get-quote', step: 2 },
      { path: 'apply-now', step: 3 }
    ],
    currentMainStep: {
      path: 'basic-information',
      step: 1
    },
}
