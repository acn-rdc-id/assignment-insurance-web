export interface PolicyClaim {
  claimId: string;
  policyId?: string;
  policyNo: string;
  claimDate: string;
  claimStatus: string;
  claimType: string;
}

export interface PolicyClaimSubmissionDetails {
  policyList: Array<{policyId: string, policyNo: string}>;
  claimPolicyDocumentList: PolicyClaimDocument[];
}

export interface PolicyClaimDetails {
  claimID: string;
  policyNo: string;
  documentList: { documentUrl: string; documentName: string }[];
  claimType: {
    claimTypeId: number;
    claimTypeName: string;
    claimTypeDescription: string;
  };
  claimDate: string;
  claimStatus: string;
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
  claimID: string;
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
