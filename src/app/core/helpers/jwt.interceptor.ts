import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { TokenStorageService } from '../services/token-storage.service';
import { environment } from '../../../environments/environment';
import {catchError} from "rxjs/operators";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private authfackservice: AuthfakeauthenticationService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {
  }

 intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  // Retrieve the token from local storage
  const token = this.tokenStorageService.getToken();

  // If the token exists, clone the request and set the Authorization header
  if (token) {
    console.log('Token exists');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Handle the request
  return next.handle(request).pipe(
    catchError((error) => {
      // If the status of the error is 401 and a token exists, log out the user
      if (error.status === 401 && token) {
        console.log('Token is expired');
        this.authenticationService.logout(); // Log out the user
        this.router.navigate(['/login']);
        return throwError('Token expired');
      }

      // If the status of the error is not 401, rethrow the error
      return throwError(error);
    })
  );
}
}
