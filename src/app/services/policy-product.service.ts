import {HttpClient, HttpHeaders} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpResponseBody} from '../models/http-body.model';

@Injectable({
  providedIn: 'root',
})
export class PolicyProductService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getPolicyDetails(user: any): Observable<HttpResponseBody> {
    const headers = new HttpHeaders({
      'userId': user.userId ?? ''
    });
    return this.http.get<HttpResponseBody>(this.apiUrl + 'policy/getAll', { headers });
  }
}
