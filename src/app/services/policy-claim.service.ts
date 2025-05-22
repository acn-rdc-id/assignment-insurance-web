import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpResponseBody } from '../models/http-body.model';
import { Observable, of } from 'rxjs';
import { POLICY_CLAIM_API } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PolicyClaimService {
  private apiUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getPolicyClaimDoc(): Observable<HttpResponseBody> {
    // return this.http.get<HttpResponseBody>(
    //   this.apiUrl + POLICY_CLAIM_API.CREATE_CLAIM_POLICY_DOCUMENT
    // );

    return of({
      status: 'Success',
      code: 200,
      message: 'Claim Policy Document Submitted Successfully!',
      timestamp: '2025-05-07T14:32:15.6705531',
      data: {
        policyClaim: {
          policyId: ['1111', '1234'],
          claimPolicyDocument: [
            {
              claimTypeId: 1,
              claimTypeName: 'Critical Illness Claim',
              claimDescription: 'Claim due to diagnosis of critical illness',
              requiredDocuments: [
                'Diagnosis Report',
                'Medical Reports',
                'ID Proof',
                'Policy Document',
              ],
            },
            {
              claimTypeId: 2,
              claimTypeName: 'TPD Claim',
              claimDescription:
                'Total Permanent Disability due to accident or illness',
              requiredDocuments: [
                'Disability Certificate',
                'Medical Reports',
                'ID Proof',
                'Policy Document',
              ],
            },
            {
              claimTypeId: 3,
              claimTypeName: 'Hospitalization Claim',
              claimDescription: '\tReimbursement of hospital expenses',
              requiredDocuments: [
                'Hospital Bills',
                'Discharge Summary',
                'ID Proof',
                'Policy Document',
              ],
            },
            {
              claimTypeId: 4,
              claimTypeName: 'Maturity Claim',
              claimDescription: 'Payout after policy term completion',
              requiredDocuments: [
                'Policy Document',
                'ID Proof',
                'Bank Account Proof',
              ],
            },
          ],
        },
      },
    });
  }
}
