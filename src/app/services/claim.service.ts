import { inject,Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpResponseBody} from '../models/http-body.model';
import {environment} from '../../environments/environment';
import {POLICY_CLAIM_API} from '../constants/api.constants';


@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private http: HttpClient = inject(HttpClient);
  private apiUrl: string = environment.apiUrl;

  getClaimList(): Observable<HttpResponseBody>{
    return this.http.get<HttpResponseBody>(
      this.apiUrl + POLICY_CLAIM_API.GET_CLAIM_LIST
    );

  }

  constructor() { }
}
