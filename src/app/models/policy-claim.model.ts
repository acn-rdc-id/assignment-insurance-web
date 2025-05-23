export interface PolicyClaim {
  policyId: string[];
  claimPolicyDocument: ClaimPolicyDocument[];
}

export interface ClaimPolicyDocument {
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
