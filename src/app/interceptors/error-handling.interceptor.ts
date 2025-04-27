import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'status: ', event.status);
      }
    }),
    catchError(err => throwError(() => new Error(err)))
  );
};
