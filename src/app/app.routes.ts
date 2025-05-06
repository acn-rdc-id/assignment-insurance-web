import { Routes } from '@angular/router';
import { userAuthGuard } from './guards/user-auth.guard';

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
    // TODO: enable userAuthGuard after integrating user signup and login
    // canActivate: [userAuthGuard]
  },
  // {
  //   path: 'policy-initial-info',
  //   loadComponent: () => import('./components/policy-purchase-initial-info/policy-purchase-initial-info.component').then(m => m.PolicyPurchaseInitialInfoComponent)
  // },
  // {
  //   path: 'policy-insured-info',
  //   loadComponent: () => import('./components/policy-purchase-insured-info/policy-purchase-insured-info.component').then(m => m.PolicyPurchaseInsuredInfoComponent),
  // },
  // {
  //   path: 'policy-purchase-plan',
  //   loadComponent: () => import('./components/policy-purchase-plan/policy-purchase-plan.component').then(m => m.PolicyPurchasePlanComponent)
  // },
  {
    path: 'policy-purchase',
    loadComponent: () => import('./components/policy-purchase/policy-purchase.component').then(m => m.PolicyPurchaseComponent)
  },
  {
    path: 'policy-purchase-summary',
    loadComponent: () => import('./components/policy-purchase-summary/policy-purchase-summary.component').then(m => m.PolicyPurchaseSummaryComponent)
  },
  {
    path: 'policy-purchase-receipt',
    loadComponent: () => import('./components/policy-purchase-receipt/policy-purchase-receipt.component').then(m => m.PolicyPurchaseReceiptComponent)
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
