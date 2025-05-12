import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpResponseBody} from '../models/http-body.model';
import {PolicySummary} from '../models/policy.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() {}

  getPlans(payload: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(this.apiUrl + 'plan/get-quotation-plan', payload);
  }

  getTermsConditions(): Observable<HttpResponseBody> {
    return this.http.get<HttpResponseBody>(this.apiUrl + 'terms');
  }

  createApplication(payload: any): Observable<HttpResponseBody> {
    const userId: string = payload.personDto?.userId ?? '';
    const headers = new HttpHeaders({
      'userId': userId
    });
    return this.http.post<HttpResponseBody>(this.apiUrl + 'policy/create-application', payload, { headers });
  }

  createPayment(payload: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(this.apiUrl + 'payment/handle-payment', payload);
  }

  getPolicyDetails(payload: { id: string }): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.apiUrl}/get-policy-details`, payload);
  }
}
