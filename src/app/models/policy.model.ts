export interface PolicyDetails {
    quotationNumber: string;
    plan?: PolicyPlan;
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
  age: number;
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
    plan: undefined,
    personalDetails: {
        gender: '',
        dateOfBirth: '',
        age: 0,
        title: '',
        fullName: '',
        nationality: '',
        idNo: '',
        otherId: '',
        isUsPerson: false,
        countryOfBirth: '',
        isSmoker: false,
        cigarettesPerDay: 0,
        countryCode: '',
        mobileNo: '',
        occupation: '',
        email: '',
        transactionPurpose: ''
    }
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

  export interface PolicyPurchaseStep {
    path: string;
    step: number;
  }
  
  export interface TermsConditions {
    id: number;
    termsHtml: string;
    isRequired: number;
  }
