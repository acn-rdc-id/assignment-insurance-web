import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { PolicyDetails } from '../models/policy-product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PolicyProductService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getPolicyDetails(): Observable<PolicyDetails[]> {
    // return this.http.get<PolicyDetails[]>(this.apiUrl + 'policy/details');

    //mock data
    return of([
      {
        name: 'John Doe',
        age: '35',
        dob: '1989-04-15',
        policy: 'LIFE123456789',
        address: '123 Main Street, Springfield, IL 62704, USA',
        icNum: 'A1234567',
      },
      {
        name: 'Jane Smith',
        age: '42',
        dob: '1982-09-30',
        policy: 'HEALTH987654321',
        address: '456 Oak Avenue, Riverside, CA 92501, USA',
        icNum: 'B7654321',
      },
      {
        name: 'Alan Tan',
        age: '29',
        dob: '1995-02-12',
        policy: 'AUTO1122334455',
        address: '789 Pine Road, Austin, TX 73301, USA',
        icNum: 'C3456789',
      },
      {
        name: 'Emily Wong',
        age: '31',
        dob: '1993-06-18',
        policy: 'LIFE5566778899',
        address: '321 Maple Lane, Seattle, WA 98101, USA',
        icNum: 'D9876543',
      },
      {
        name: 'Raj Kumar',
        age: '47',
        dob: '1978-12-05',
        policy: 'HOME2233445566',
        address: '654 Cedar Street, Miami, FL 33101, USA',
        icNum: 'E2345678',
      },
    ]);
  }
}
