import { PolicyPlan } from "../../models/policy.model";
  
export interface PolicyStateModel {
    referenceNumber: string;
    gender: string;
    dateOfBirth: string;
    ageNearestBirthday: number;
    plans: PolicyPlan[];
    selectedPlan: PolicyPlan | null;
}
  