import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
          if (err.error === 'Invalid username or password'){
            this.authenticationService.logout();

          }else if (err.error.message === 'Http failure response for http://localhost:1919/auth/verify-code: 401 OK') {
            console.log(err.error)
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            // location.reload();
          }else if (err.status === 401) {
             console.log(err.error)
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
             //location.reload();
            }
          console.log('Error status:', err); // Log the status of the error
          console.log('Error message:', err.error.message || err.statusText); // Log the message of the error

          const error = err.error.message || err.statusText;

            return throwError(err);
        }))
    }
}

