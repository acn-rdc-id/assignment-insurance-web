import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngxs/store';
import { withNgxsStoragePlugin, StorageOption } from '@ngxs/storage-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { UserState } from './store/user/user.state';
import { errorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { PolicyPurchaseState } from './store/policy/policy-purchase.state';
import { PolicyProductState } from './store/policy-product/policy-product.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([errorHandlingInterceptor, loadingInterceptor])
    ),
    provideStore(
      [UserState, PolicyPurchaseState, PolicyProductState],
      withNgxsStoragePlugin({
        keys: '*',
        storage: 1,
      }),
      withNgxsReduxDevtoolsPlugin(),
      withNgxsLoggerPlugin({ disabled: environment.production })
    ),
  ],
};
