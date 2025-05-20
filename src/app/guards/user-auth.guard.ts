import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from '../store/user/user.state';
import { User } from '../models/user.model';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const isLoggedIn = store.selectSnapshot(UserState.isLoggedIn);
  if (isLoggedIn) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
