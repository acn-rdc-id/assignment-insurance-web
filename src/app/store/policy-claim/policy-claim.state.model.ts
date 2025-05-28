import {
  PolicyClaimDocument,
  PolicyClaim,
  PolicyClaimStep,
  PolicyClaimSubmissionDetails,
} from '../../models/policy-claim.model';

export interface PolicyClaimStateModel {
  policyClaim: PolicyClaim[];
  policyClaimSubmissionDetails: PolicyClaimSubmissionDetails;
  mainSteps: PolicyClaimStep[];
  currentMainStep: PolicyClaimStep;
  selectedPolicyId: number;
  selectedTypeOfClaim: PolicyClaimDocument;
  docUpload: any;
}

export const POLICY_CLAIM_STATE_DEFAULTS: PolicyClaimStateModel = {
  policyClaim: [],
  policyClaimSubmissionDetails: {
    policyIdList: [],
    claimPolicyDocumentList: [],
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
  docUpload: undefined,
};
