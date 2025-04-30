import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResponseBody } from '../models/http-body.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private readonly apiUrl = 'https://your-api-url.com/policy'; // <-- replace with actual endpoint

  constructor(private http: HttpClient) {}

  getPlans(payload: { gender: string; dateOfBirth: string }): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(`${this.apiUrl}/get-plans`, payload);
  }
}
