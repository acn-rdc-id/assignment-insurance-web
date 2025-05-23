import {Routes} from '@angular/router';
import {userAuthGuard} from './guards/user-auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'registration',
    loadComponent: () => import('./components/user-registration/user-registration.component').then(m => m.UserRegistrationComponent)
  },
  {
    path: 'policy-product',
    loadComponent: () => import('./components/policy-product/policy-product.component').then(m => m.PolicyProductComponent),
    canActivate: [userAuthGuard]
  },
  {
    path: 'policy-purchase',
    loadComponent: () => import('./components/policy-purchase/policy-purchase.component').then(m => m.PolicyPurchaseComponent),
    canActivate: [userAuthGuard]
  },
  {
    path: 'policy-servicing',
    loadComponent: () => import('./components/policy-servicing/policy-servicing.component').then(m => m.PolicyServicingComponent),
    canActivate: [userAuthGuard]
  },
  {
    path: 'policy-servicing-details/:policyNo',
    loadComponent: () => import('./components/policy-servicing-details/policy-servicing-details.component').then(m => m.PolicyServicingDetailsComponent),
    canActivate: [userAuthGuard]
  },
  {
    path: 'claim-list',
    loadComponent: () => import('./components/claim-list/claim-list.component').then(m => m.ClaimListComponent),
    canActivate: [userAuthGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
