import { PolicyClaim } from '../../models/policy-claim.model';
import {
  PolicyDetails,
  PolicyPlanDto,
  TermsConditions,
  PolicyPurchaseStep,
  POLICY_DETAILS_DEFAULT,
  PaymentDetails,
} from '../../models/policy.model';

export interface PolicyPurchaseStateModel {
  mainSteps: PolicyPurchaseStep[];
  subSteps: PolicyPurchaseStep[];
  currentMainStep: PolicyPurchaseStep;
  currentSubStep: PolicyPurchaseStep;
  quotationDetails: PolicyDetails;
  plans: PolicyPlanDto[];
  termsAndConditions: TermsConditions[];
  paymentDetails: PaymentDetails;
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
  quotationDetails: POLICY_DETAILS_DEFAULT,
  plans: [],
  termsAndConditions: [],
  paymentDetails: {
    paymentId: 0,
    paymentRefNo: '',
    paymentDate: '',
    status: ''
  },
  mainSteps: [
    { path: 'basic-information', step: 1 },
    { path: 'get-quote', step: 2 },
    { path: 'apply-now', step: 3 },
  ],
  currentMainStep: {
    path: 'basic-information',
    step: 1,
  },
  subSteps: [
    { path: 'info-details', step: 1 },
    { path: 'info-summary', step: 2 },
    { path: 'info-receipt', step: 3 },
  ],
  currentSubStep: {
    path: 'info-details',
    step: 1,
  },
};
