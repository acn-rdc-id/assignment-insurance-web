import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User, UserLoginForm } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  // TODO: Change type to {userDetails: User, jwtToken: string}
  userLogin(payload: UserLoginForm): Observable<{userDetails: User, token: string}> {
    return this.http.post<{userDetails: User, token: string}>(this.apiUrl + 'auth/login', payload);
  }
}
