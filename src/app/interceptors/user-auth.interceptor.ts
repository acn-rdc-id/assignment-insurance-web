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

  const isFormData: boolean = req.body instanceof FormData;

  if (!req.context.get(SkipUserAuthHeaders)) {
    let authHeader = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'userId': user.userId
    });

    if (!isFormData) {
      authHeader = authHeader.set('Content-Type', 'application/json');
    }

    const authorizedRequest = req.clone({
      headers: authHeader
    });
    return next(authorizedRequest);
  } else {
    return next(req);
  }
};
