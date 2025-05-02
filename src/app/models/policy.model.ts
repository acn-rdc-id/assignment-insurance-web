export interface PolicyDetails {
    quotationNumber: string;
    gender: string;
    dateOfBirth: string;
    age: number;
    plan?: PolicyPlan
    personalDetails?: PolicyPersonalDetails
}

export interface PolicyPlanDto {
    planName: string;
    sumAssured: number;
    coverageTerm: string;
    monthlyPremium: number;
    yearlyPremium: number;
}

export interface PolicyPlan {
    planName: string;
    sumAssured: number;
    coverageTerm: string;
    premiumAmount: number;
    paymentPeriod: string;
}

export interface PolicyPersonalDetails {
  title: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  idNo: string;
  otherId: string;
  isUsPerson: boolean;
  countryOfBirth: string;
  isSmoker: boolean;
  cigarettesPerDay: number;
  countryCode: string;
  // areaCode: string;
  mobileNo: string;
  occupation: string;
  email: string;
  transactionPurpose: string;
}

export const POLICY_DETAILS_DEFAULT: PolicyDetails = {
    quotationNumber: '',
    gender: '',
    dateOfBirth: '',
    age: 0,
    plan: undefined
}
