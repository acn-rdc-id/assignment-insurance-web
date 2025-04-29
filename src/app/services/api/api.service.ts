import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PolicyDetails } from '../../models/policy-product.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getPolicyDetails(): Observable<PolicyDetails[]> {
    return this.http.get<PolicyDetails[]>('https://api/policies/details');
  }
}
