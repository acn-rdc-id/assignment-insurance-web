import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseBody } from '../models/http-body.model';
import { PolicyDetails, PolicyPlanDto, PolicySummary } from '../models/policy.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  getPlans(payload: any): Observable<HttpResponseBody[]> {
    return this.http.post<HttpResponseBody[]>(this.apiUrl + 'plan/get-quotationPlan', payload);
  }

  getTermsConditions(): Observable<HttpResponseBody> {
    return this.http
      .get<HttpResponseBody>(this.apiUrl + 'terms');
  }

  purchasePlan(payload: PolicySummary): 
  Observable<HttpResponseBody> {
    const httpContext = new HttpContext();
    return this.http.post<HttpResponseBody>(`${this.apiUrl}/purchase-plans`, payload, { context: httpContext });
  }

  getPolicyDetails(payload: { id: string }): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.apiUrl}/get-policy-details`, payload);
  }
}
