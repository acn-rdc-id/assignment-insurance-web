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

export interface PolicyClaimList {
  claimId: string;
  policyNo: string;
  documentList: DocumentList[];
  claimType: ClaimType;
  claimDate: string;
  claimStatus: string;
}

export interface DocumentList {
  documentUrl: string;
  documentName: string;
}

export interface ClaimType {
  claimTypeId: number;
  claimTypeName: string;
  claimTypeDescription: string;
}
