export interface PolicyDetails {
    quotationNumber: string;
    gender: string;
    dateOfBirth: string;
    age: number;
    plan?: PolicyPlan
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

export const POLICY_DETAILS_DEFAULT: PolicyDetails = {
    quotationNumber: '',
    gender: '',
    dateOfBirth: '',
    age: 0,
    plan: undefined
}

export interface PolicySummary {
    name: string;
    nric: string;
    dob: string;
    gender: string;
    nationality: string;
    birthCountry: string;
    usPerson: string;
    mobileNum: string;
    email: string;
    smoker: string;
    occupation: string;
    purpose: string;
  
    [key: string]: string;
  }
  
  export interface TermsConditions {
    terms_id: number;
    terms_html: string;
  }