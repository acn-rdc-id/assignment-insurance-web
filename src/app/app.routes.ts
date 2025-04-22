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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
