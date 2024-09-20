import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import { User } from 'src/app/store/Authentication/auth.models';
import {GlobalComponent} from "../../global-component";
import {AuthenticationService} from "./auth.service";
import {Observable, of, throwError} from "rxjs";
import {catchError} from "rxjs/operators";



const API_URL = GlobalComponent.API_URL;
const USER = GlobalComponent.user;
@Injectable({ providedIn: 'root' })
export class UserProfileService {
    constructor(private http: HttpClient,
                private authService: AuthenticationService) { }


  
  register(user: User) {
        return this.http.post(`/users/register`, user);
  }
  getUserByEmail(email: string):Observable<User>   {
    return this.http.get<User>(API_URL+USER+`email/${email}`);
  }
  getCurrentUser() {
    const email = this.authService.currentUser()['sub'];
    console.log(email + "email");
    return this.getUserByEmail(email).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return of(null); // Return a default value (null) if an error occurs
      })
    );
  }
  getAllUsers(): Observable<User> {
    return this.http.get(API_URL+USER+`all`);
  }
  public removeUser(idUser:number):Observable<any> {
    return this.http.delete(API_URL+USER+"delete/"+idUser);
  }
  


  blockUser(id: number): Observable<User> {
    console.log(id);
    return this.http.put<User>(API_URL+USER+`block/${id}`, {}).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }

  unblockUser(id: number): Observable<any> {
      console.log(id)
    return this.http.put<User>(API_URL+USER+`unblock/${id}`,{});
  }
  uploadProfilePicture(file: File, email: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('email', this.authService.currentUser()['sub']);

    const req = new HttpRequest('POST', API_URL+USER+`upload-profile-picture`, formData, {
      reportProgress: true,
      responseType: 'json'
    });


    return this.http.request(req).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(error);
      })
    );
  }


  getImage(imageName: string): Observable<Blob> {
    return this.http.get(API_URL+USER+`image/${imageName}`, { responseType: 'blob' });
  }
}
