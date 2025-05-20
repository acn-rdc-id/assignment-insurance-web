import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpResponseBody} from '../models/http-body.model';
import {POLICY_SERVICING_API} from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PolicyProductService {
  private apiUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getAllPolicies(): Observable<HttpResponseBody> {
    return this.http.get<HttpResponseBody>(
      this.apiUrl + POLICY_SERVICING_API.GET_ALL_POLICIES
    );
  }

  postListBeneficiaries(payload: any): Observable<HttpResponseBody> {
    return this.http.post<HttpResponseBody>(
      this.apiUrl + POLICY_SERVICING_API.CREATE_BENEFICIARIES,
      payload
    );
  }
}
