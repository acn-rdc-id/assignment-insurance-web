import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseBody } from '../models/http-body.model';
import { PolicyDetails, PolicySummary } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly apiUrl = 'https://your-api-url.com/policy'; // <-- replace with actual endpoint

  constructor(private http: HttpClient) {}

  getPlans(payload: { gender: string; dateOfBirth: string }): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.apiUrl}/get-plans`, payload);
  }

  getTermsConditions(): Observable<HttpResponseBody> {
    const httpContext = new HttpContext();
    return this.http
      .get<HttpResponseBody>(this.apiUrl + 'terms', { context: httpContext });
  }

  purchasePlan(payload: PolicySummary): 
  Observable<HttpResponseBody> {
    const httpContext = new HttpContext();
    return this.http.post<HttpResponseBody>(`${this.apiUrl}/purchase-plans`, payload, { context: httpContext });
  }
}
