import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PolicyDetails } from '../models/policy.model';
import { environment } from '../../environments/environment';
import { SkipUserAuthHeaders } from '../interceptors/user-auth.interceptor';
import { HttpResponseBody } from '../models/http-body.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyProductService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getPolicyDetails(): Observable<HttpResponseBody> {
    // const httpContext = new HttpContext().set(SkipUserAuthHeaders, true);
    // return this.http.get<HttpResponseBody>(this.apiUrl + 'policy/details', {
    //   context: httpContext,
    // });

    //Mock Data
    return of({
      code: 200,
      data: {
        quotationNumber: 'QTN-20240501-001',
        gender: 'Male',
        dateOfBirth: '1990-07-15',
        age: 34,
        plan: {
          planName: 'Life Shield Plus',
          sumAssured: 500000,
          coverageTerm: '20 years',
          premiumAmount: 1250,
          paymentPeriod: 'Monthly',
        },
      },
    });
  }
}
