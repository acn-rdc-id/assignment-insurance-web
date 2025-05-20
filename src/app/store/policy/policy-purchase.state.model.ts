import {PolicyDetails, PolicyPlanDto, TermsConditions, PolicyPurchaseStep} from "../../models/policy.model";

export interface PolicyPurchaseStateModel {
    mainSteps: PolicyPurchaseStep[];
    subSteps: PolicyPurchaseStep[];
    currentMainStep: PolicyPurchaseStep;
    currentSubStep: PolicyPurchaseStep;
    quotationDetails: PolicyDetails;
    plans: PolicyPlanDto[];
    termsAndConditions: TermsConditions[];
}

// export const POLICY_PURCHASE_STATE_DEFAULTS: PolicyPurchaseStateModel = {
//     quotationDetails: {
//         quotationNumber: '',
//         gender: '',
//         dateOfBirth: '',
//         age: 0,
//         plan: undefined
//     },
//     plans: []
// }

export const POLICY_PURCHASE_STATE_DEFAULTS: PolicyPurchaseStateModel = {
    quotationDetails: {
        quotationNumber: '',
        plan: undefined,
        personalDetails: undefined,
    },
    plans: [],
    termsAndConditions: [],
    mainSteps: [
      { path: 'basic-information', step: 1 },
      { path: 'get-quote', step: 2 },
      { path: 'apply-now', step: 3 }
    ],
    currentMainStep: {
      path: 'basic-information',
      step: 1
    },
    subSteps: [
      { path: 'info-details', step: 1 },
      { path: 'info-summary', step: 2 },
      { path: 'info-receipt', step: 3 }
    ],
    currentSubStep: {
      path: 'info-details',
      step: 1
    },
}
