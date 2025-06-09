import {
  PolicyClaimDocument,
  PolicyClaim,
  PolicyClaimStep,
  PolicyClaimSubmissionDetails,
  PolicyClaimList,
  PolicyClaimDetails,
} from '../../models/policy-claim.model';

export interface PolicyClaimStateModel {
  policyClaim: PolicyClaim[];
  policyClaimSubmissionDetails: PolicyClaimSubmissionDetails;
  mainSteps: PolicyClaimStep[];
  currentMainStep: PolicyClaimStep;
  selectedPolicyId: number;
  selectedTypeOfClaim: PolicyClaimDocument;
  claimDetails: PolicyClaimDetails;
  docUpload: any;
}

export const POLICY_CLAIM_STATE_DEFAULTS: PolicyClaimStateModel = {
  policyClaim: [],
  policyClaimSubmissionDetails: {
    policyList: [],
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
  claimDetails: {
    claimID: '',
    policyNo: '',
    documentList: [{ documentUrl: '', documentName: '' }],
    claimType: {
      claimTypeId: 0,
      claimTypeName: '',
      claimTypeDescription: '',
    },
    claimDate: '',
    claimStatus: '',
  },
  docUpload: undefined,
};
