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
      data: [
        {
          quotationNumber: 'QT-1234567890',
          plan: {
            planName: 'Life Secure Plan',
            sumAssured: 500000,
            coverageTerm: '20 years',
            premiumAmount: 1500,
            paymentPeriod: '10 years',
          },
          personalDetails: {
            title: 'Mr.',
            fullName: 'John Doe',
            gender: 'Male',
            dateOfBirth: '1985-06-15',
            age: 39,
            nationality: 'Malaysian',
            idNo: '850615-14-5678',
            otherId: 'MY1234567',
            isUsPerson: false,
            countryOfBirth: 'Malaysia',
            isSmoker: true,
            cigarettesPerDay: 5,
            countryCode: '+60',
            mobileNo: '123456789',
            occupation: 'Software Engineer',
            email: 'johndoe@example.com',
            transactionPurpose: 'Investment and savings',
          },
        },
        {
          quotationNumber: 'QT-9876543210',
          plan: {
            planName: 'Family Protection Plan',
            sumAssured: 1000000,
            coverageTerm: '25 years',
            premiumAmount: 2000,
            paymentPeriod: '15 years',
          },
          personalDetails: {
            title: 'Mrs.',
            fullName: 'Jane Smith',
            gender: 'Female',
            dateOfBirth: '1990-08-22',
            age: 34,
            nationality: 'Singaporean',
            idNo: '900822-11-7890',
            otherId: 'SG1234567',
            isUsPerson: false,
            countryOfBirth: 'Singapore',
            isSmoker: false,
            cigarettesPerDay: 0,
            countryCode: '+65',
            mobileNo: '987654321',
            occupation: 'Financial Analyst',
            email: 'janesmith@example.com',
            transactionPurpose: 'Long-term family security',
          },
        },
      ],
    });
  }
}
