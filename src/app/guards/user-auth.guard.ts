import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserState } from '../store/user/user.state';

export const userAuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  const jwtToken = store.selectSnapshot(UserState.getJwtToken);
  if (jwtToken !== null && jwtToken !== '' && jwtToken.length > 0) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
