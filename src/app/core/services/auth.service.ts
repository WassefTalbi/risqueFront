import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { User } from '../../store/Authentication/auth.models';
import { getFirebaseBackend } from 'src/app/authUtils';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { GlobalComponent } from "../../global-component";

// Action
import { login, loginSuccess, loginFailure, logout, logoutSuccess, RegisterSuccess } from '../../store/Authentication/authentication.actions';

// Firebase
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';



const AUTH_API = GlobalComponent.AUTH_API;

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    user!: User;
    currentUserValue: any;
  private token: string | null = null;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(private http: HttpClient, private store: Store, private afAuth: AngularFireAuth) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    }

    // Sign in with Google provider
    signInWithGoogle(): Promise<User> {
        const provider = new firebase.auth.GoogleAuthProvider();
        return this.signInWithPopup(provider);
    }

    // Sign in with Facebook provider
    signInWithFacebook(): Promise<User> {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.signInWithPopup(provider);
    }

    // Sign in with a popup for the specified provider
    private async signInWithPopup(provider: firebase.auth.AuthProvider): Promise<User> {
        try {
            const result = await this.afAuth.signInWithPopup(provider);
            const user = result.user;
            return {
                //     uid: user.uid,
                //     displayName: user.displayName,
                //     email: user.email,
                //     // Add other user properties as needed
            };
        } catch (error) {
            throw new Error('Failed to sign in with the specified provider.');
        }
    }

    // Sign out the current user
    signOut(): Promise<void> {
        return this.afAuth.signOut();
    }


    register(email: string, first_name: string, password: string) {
        return this.http.post(AUTH_API + 'signup', {
            email,
            first_name,
            password,
        }, httpOptions).pipe(
            map((response: any) => {
                const user = response;
                this.store.dispatch(RegisterSuccess({ user }));
                return user;
            }),
            catchError((error: any) => {
                const errorMessage = 'Login failed'; // Customize the error message as needed
                this.store.dispatch(loginFailure({ error: errorMessage }));
                return throwError(errorMessage);
            })
        );
    }
  registerUser(registerData:any) {
    return this.http.post<any>(AUTH_API + 'register', registerData);
  }


  /* login(email: string, password: string) {
       this.store.dispatch(login({ email, password }));

       return this.http.post(AUTH_API + 'login', {
           email,
           password
       }, httpOptions).pipe(
           map((response: any) => {
               const user = response;
               this.store.dispatch(loginSuccess({ user }));
               return user;
           }),
           catchError((error: any) => {
               const errorMessage = 'Login failed'; // Customize the error message as needed
               this.store.dispatch(loginFailure({ error: errorMessage }));
               return throwError(errorMessage);
           })
       );
   }*/
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(AUTH_API+`login`, { username, password }).pipe(
      tap(response => {
        if (response && response.accessToken) {
          this.token = response.accessToken;
          localStorage.setItem('token', this.token ?? ''); // Store token in local storage
          localStorage.setItem('currentUser',JSON.stringify(this.currentUser()));
         // this.currentUserSubject.next(response.user);
          console.log(this.currentUser()['scope'])
         // localStorage.setItem('currentUser', JSON.stringify(response.user)); // Store user in local storage

        }
      })
    );
  }

 /* login(email: string, password: string) {
    return this.http.post(GlobalComponent.AUTH_API + 'login', { email, password }, httpOptions).pipe(
      map((response: any) => {
        const token = response.token.acces; // Assuming your token is returned as 'token' property in the response
        localStorage.setItem('token', token); // Save token to local storage
        const user = response.user; // Assuming your user information is returned as 'user' property in the response
        localStorage.setItem('currentUser', JSON.stringify(user)); // Save user to local storage
        this.currentUserSubject.next(user); // Emit the current user
        return response;
      }),
      catchError((error: any) => {
        const errorMessage = 'Login failed'; // Customize the error message as needed
        return throwError(errorMessage);
      })
    );
  }*/

  logout(): Observable<void> {
        this.store.dispatch(logout());
        // Perform any additional logout logic, e.g., calling an API to invalidate the token

        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null!);
        this.store.dispatch(logoutSuccess());

        // Return an Observable<void> indicating the successful logout
        return of(undefined).pipe(
            tap(() => {
                // Perform any additional logic after the logout is successful
            })
        );
    }



    /**
 * Returns the current user
 */
    public currentUser(): any {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = token.split('.')[1]; // Get the payload part of the JWT token
        const decodedPayload = atob(payload); // Decode the payload using atob()
        return JSON.parse(decodedPayload); // Parse the decoded payload into a JavaScript object
      }
      return null; // Return null if token is not found
    }
  isAdmin(): boolean {
    const currentUser = this.currentUser();
    return currentUser && currentUser['scope'] === 'ADMIN';
  }
  isUser(): boolean {
    const currentUser = this.currentUser();
    return currentUser && currentUser['scope'] === 'USER';
  }
  /* public currentUser(): any {
       return getFirebaseBackend()!.getAuthenticatedUser();
   }*/


  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(AUTH_API+`forgot-password`, { email: email });
  }

  verifyCode(code: string): Observable<any> {
    return this.http.post<any>(AUTH_API+`verify-code`, { code: code });
  }

  resetPassword(token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(AUTH_API+`reset-password`, { token, password, confirmPassword });
  }



  uploadFile(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this.http.post<string>(AUTH_API+ 'upload', formData, httpOptions).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }
}
