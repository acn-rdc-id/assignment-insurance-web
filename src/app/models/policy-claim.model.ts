export interface PolicyClaim {
  claimId: string;
  policyId: string;
  claimDate: string;
  claimStatus: string;
  claimType: string;
  claimDetails?: undefined;
  claimdocuments?: undefined;
}
export interface PolicyClaimSubmissionDetails {
  policyIdList: string[];
  claimPolicyDocumentList: PolicyClaimDocument[];
}

export interface PolicyClaimDocument {
  typeOfClaim: string;
  claimTypeId: number;
  claimTypeName: string;
  claimTypeDescription: string;
  requiredDocuments: string[];
}

export interface PolicyClaimStep {
  path: string;
  step: number;
}
