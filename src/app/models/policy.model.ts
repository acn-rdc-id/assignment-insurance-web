export interface PolicyDetails {
    policyId: number;
    quotationNumber: string;
    plan: PolicyPlan;
    personalDetails: PolicyPersonalDetails,
    beneficiariesList: Array<PolicyBeneficiary>,
    status: string;
    endDate: string;
    startDate: string;
}

export interface PolicyPlanDto {
    id: string;
    planName: string;
    sumAssured: number;
    coverageTerm: string;
    monthlyPremium: number;
    yearlyPremium: number;
    paymentPeriod: string;
}

export interface PolicyPlan {
    id: string;
    planName: string;
    sumAssured: number;
    coverageTerm: string;
    premiumAmount: number;
    premiumMode?: string;
    paymentPeriod?: string;
    referenceNumber?: string;
    duration?: number;
}

export interface PolicyPersonalDetails {
  [key: string]: any;
  policyId?: number,
  title?: string;
  fullName?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  nationality?: string;
  idNo?: string;
  otherId?: string;
  isUsPerson?: boolean;
  countryOfBirth?: string;
  isSmoker?: boolean;
  cigarettesPerDay?: number;
  countryCode?: string;
  // areaCode?: string;
  mobileNo?: string;
  occupation?: string;
  email?: string;
  transactionPurpose?: string;
}

export interface PolicyBeneficiary {
  id?: string;
  beneficiaryName: string;
  relationshipToInsured: string;
  share: number;
}

export const POLICY_DETAILS_DEFAULT: PolicyDetails = {
  policyId: 0,
  quotationNumber: '',
  plan: {
    id: '',
    planName: '',
    premiumAmount: 0,
    sumAssured: 0,
    coverageTerm: '',
    paymentPeriod: '',
    duration: 0,
    premiumMode: '',
    referenceNumber: ''
  },
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
  },
  beneficiariesList: [],
  startDate: '',
  endDate: '',
  status: ''
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
  status: string;
}

export interface PaymentDetails {
  paymentId: number;
  paymentRefNo: string;
  paymentDate: string;
  status: string;
}

export const MAX_BENEFICIARIES: number = 2;
