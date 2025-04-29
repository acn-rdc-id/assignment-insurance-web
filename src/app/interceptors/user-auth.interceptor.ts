import { inject } from '@angular/core';
import { HttpContextToken, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { UserState } from '../store/user/user.state';
import { User } from '../models/user.model';

export const SkipUserAuthHeaders = new HttpContextToken<boolean>(() => false);

export const userAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authToken = store.selectSnapshot(UserState.getJwtToken);
  const user: User = store.selectSnapshot(UserState.getUser);
  if (!req.context.get(SkipUserAuthHeaders)) {
    const authHeader = new HttpHeaders({
      'Content-Type': 'application.json',
      'Authorization': `Bearer ${authToken}`,
      'userId': user.userId
    });
    const authorizedRequest = req.clone({
      headers: authHeader
    });
    return next(authorizedRequest);
  } else {
    return next(req);
  }
};
