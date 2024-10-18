import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';

const API_URL = GlobalComponent.API_URL;
const DEPARTEMENT = GlobalComponent.DEPARTEMENT;
@Injectable({
  providedIn: 'root'
})
export class DepartementService { 

  constructor(private http: HttpClient) { }
  public getDepartementByEntreprise(offset: number, pageSize: number, field: string,idEntreprise:any): Observable<any> {
    return this.http.get(API_URL+DEPARTEMENT+"all/"+offset+"/"+pageSize+"/"+field+"/"+idEntreprise);
  }
  public getDepartmentById(idDepartement: any): Observable<any> {
    return this.http.get(API_URL+DEPARTEMENT+"findById/"+idDepartement);
  }
  public addDepartement(data:any,idEntreprise:any):Observable<any> {
    return this.http.post(API_URL+DEPARTEMENT+"add/"+idEntreprise,data);
  }
  public editDepartement(idDepartement:number,data:any):Observable<any> {
    return this.http.put(API_URL+DEPARTEMENT+"edit/"+idDepartement,data);
  }
  public removeDepartement(idDepartement:number):Observable<any> {
    return this.http.delete(API_URL+DEPARTEMENT+"delete/"+idDepartement);
  }
}
