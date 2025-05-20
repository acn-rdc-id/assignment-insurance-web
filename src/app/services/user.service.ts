import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserLoginForm, UserRegistrationForm } from '../models/user.model';
import { environment } from '../../environments/environment';
import { SkipUserAuthHeaders } from '../interceptors/user-auth.interceptor';
import { HttpResponseBody } from '../models/http-body.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  userLogin(payload: UserLoginForm): Observable<HttpResponseBody> {
    const httpContext = new HttpContext().set(SkipUserAuthHeaders, true);
    return this.http.post<HttpResponseBody>(
      this.apiUrl + 'auth/login', payload, {context: httpContext}
    );
  }

  userRegistration(payload: UserRegistrationForm): Observable<HttpResponseBody> {
    const httpContext = new HttpContext().set(SkipUserAuthHeaders, true);
    return this.http.post<HttpResponseBody>(
      this.apiUrl + 'auth/signup', payload, {context: httpContext}
    );
  }
}
