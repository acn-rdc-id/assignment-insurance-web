import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpResponseBody} from '../models/http-body.model';
import {environment} from '../../environments/environment';
import {POLICY_PURCHASE_API, POLICY_SERVICING_API} from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getQuotationPlans(payload: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      this.apiUrl + POLICY_PURCHASE_API.GET_QUOTATION_PLANS, payload
    );
  }

  getTermsAndConditions(): Observable<HttpResponseBody> {
    return this.http.get<HttpResponseBody>(
      this.apiUrl + POLICY_PURCHASE_API.GET_TERMS_AND_CONDITIONS
    );
  }

  createPolicyApplication(applicationPayload: any): Observable<HttpResponseBody> {
    const userId: string = applicationPayload.personDto?.userId ?? '';
    const headers = new HttpHeaders({ userId });

    return this.http.post<HttpResponseBody>(
      this.apiUrl + POLICY_PURCHASE_API.CREATE_APPLICATION,
      applicationPayload,
      { headers }
    );
  }

  initiatePayment(paymentPayload: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      this.apiUrl + POLICY_PURCHASE_API.CREATE_PAYMENT,
      paymentPayload
    );
  }

  fetchPolicyDetails(policyIdentifier: { id: string }): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      this.apiUrl + POLICY_SERVICING_API.GET_POLICY_DETAILS,
      policyIdentifier
    );
  }
}
