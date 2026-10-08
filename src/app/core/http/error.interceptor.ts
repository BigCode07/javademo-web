import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error';

interface ProblemDetail {
  detail?: string;
  errors?: Record<string, string>;
}

/** Traduce HttpErrorResponse (ProblemDetail RFC 9457) a un ApiError uniforme. */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        return throwError(() => new ApiError('No se pudo conectar con el servidor', 0));
      }
      const problem = (error.error ?? {}) as ProblemDetail;
      const message = problem.detail ?? 'Ocurrió un error inesperado';
      return throwError(() => new ApiError(message, error.status, problem.errors));
    }),
  );
