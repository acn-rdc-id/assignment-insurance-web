import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpResponseBody} from '../models/http-body.model';
import {POLICY_SERVICING_API} from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PolicyProductService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getAllPolicies(user: { userId: string }): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({
      userId: user.userId || ''
    });

    return this.http.get<HttpResponseBody>(
      this.apiUrl + POLICY_SERVICING_API.GET_ALL_POLICIES,
      { headers }
    );
  }
}
