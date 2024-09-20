import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GlobalComponent} from "../../global-component";



const API_URL = GlobalComponent.API_URL;
const Models = GlobalComponent.models;
@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor(private http: HttpClient) { }

  addModelSTT(modelSTT: any): Observable<any> {
    return this.http.post<any>(API_URL+Models+`addModelSTT`, modelSTT);
  }
  getAllModels(): Observable<any> {
    return this.http.get<any>(API_URL+Models+`all`);
  }
  modifyModelSTT(modelSTT: any): Observable<any> {
    return this.http.put<any>(API_URL+Models+`modifyModelSTT`, modelSTT);
  }

  deleteModelSTT(id: number): Observable<any> {
    return this.http.delete<any>(API_URL+Models+`${id}/deleteModelSTT`);
  }

  assignUserToModelSTT(userId: number, modelSTTId: number): Observable<any> {
    return this.http.post<any>(API_URL+Models+`${userId}/${modelSTTId}`, {});
  }
}
