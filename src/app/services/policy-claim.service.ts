import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpResponseBody } from '../models/http-body.model';
import { Observable, of } from 'rxjs';
import { POLICY_CLAIM_API } from '../constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PolicyClaimService {
  private apiUrl: string = environment.apiUrl;
  private http: HttpClient = inject(HttpClient);

  getPolicyClaimDoc(): Observable<HttpResponseBody> {
    return this.http.get<HttpResponseBody>(
      this.apiUrl + POLICY_CLAIM_API.CREATE_CLAIM_POLICY_DOCUMENT
    );
  }

    getClaimList(): Observable<HttpResponseBody>{
    return this.http.get<HttpResponseBody>(
      this.apiUrl + POLICY_CLAIM_API.GET_CLAIM_LIST
    );

  }
  
}
