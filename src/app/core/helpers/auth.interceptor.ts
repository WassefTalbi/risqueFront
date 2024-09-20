import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TokenStorageService } from '../services/token-storage.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    }
    return next.handle(authReq).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(err);
      })
    );
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
