import { PolicyDetails, PolicyPlanDto } from "../../models/policy.model";
  
export interface PolicyPurchaseStateModel {
    // referenceNumber: string;
    // gender: string;
    // dateOfBirth: string;
    // ageNearestBirthday: number;
    
    quotationDetails: PolicyDetails
    plans: PolicyPlanDto[];
}
  