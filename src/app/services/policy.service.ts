import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PolicyStateModel } from '../store/policy/policy.state.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly apiUrl = 'https://your-api-url.com/policy'; // <-- replace with actual endpoint

  constructor(private http: HttpClient) {}

  getPlans(payload: { gender: string; dateOfBirth: string }): Observable<PolicyStateModel> {
    return this.http.post<PolicyStateModel>(`${this.apiUrl}/get-plans`, payload);
  }
}
