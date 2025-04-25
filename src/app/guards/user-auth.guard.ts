import { CanActivateFn } from '@angular/router';

export const userAuthGuard: CanActivateFn = (route, state) => {
  // TODO: Implement user authentication based on token and user details in session storage
  return true;
};
