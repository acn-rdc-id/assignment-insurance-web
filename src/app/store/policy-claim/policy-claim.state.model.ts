import { Claims } from '../../models/claim.model';
import {
  ClaimPolicyDocument,
  PolicyClaim,
  PolicyClaimStep,
} from '../../models/policy-claim.model';

export interface PolicyClaimStateModel {
  policyClaim: PolicyClaim;
  mainSteps: PolicyClaimStep[];
  currentMainStep: PolicyClaimStep;
  selectedPolicyId: number;
  selectedTypeOfClaim: ClaimPolicyDocument;
  claimList: Claims
}

export const POLICY_CLAIM_STATE_DEFAULTS: PolicyClaimStateModel = {
  claimList: {
    claimId: '',
    policyId: '',
    claim_date: '',
    claimStatus: '',
    claimType: '',
    claimdetails:undefined,
    claimdocuments:undefined
    },
  policyClaim: {
    policyId: [],
    claimPolicyDocument: [],
  },
  mainSteps: [
    { path: 'claim-selection', step: 1 },
    { path: 'claim-upload', step: 2 },
  ],
  currentMainStep: { path: 'claim-selection', step: 1 },
  selectedPolicyId: 0,
  selectedTypeOfClaim: {
    claimTypeId: 0,
    claimTypeName: '',
    claimTypeDescription: '',
    requiredDocuments: [],
    typeOfClaim: '',
  },
};
