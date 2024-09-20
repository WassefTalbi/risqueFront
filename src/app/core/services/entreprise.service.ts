import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
const API_URL = GlobalComponent.API_URL;
const ENTREPRISE = GlobalComponent.ENTREPRISE;
@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {

  constructor(private http: HttpClient) { } 

 public getEntreprisesswithPaginationAndSorting(offset: number, pageSize: number, field: string): Observable<any> {
    return this.http.get(API_URL+ENTREPRISE+"all/"+offset+"/"+pageSize+"/"+field);
  }
  public getEntrepriseById(idEntreprise: any): Observable<any> {
    return this.http.get(API_URL+ENTREPRISE+"findById/"+idEntreprise);
  }
  public addEntreprise(data:any):Observable<any> {
    return this.http.post(API_URL+ENTREPRISE+"add",data);
  }
  public editEntreprise(idEntreprise:any,data:any):Observable<any> {
    return this.http.put(API_URL+ENTREPRISE+"edit/"+idEntreprise,data);
  }
  public removeEntreprise(idEntreprise:number):Observable<any> {
    return this.http.delete(API_URL+ENTREPRISE+"delete/"+idEntreprise);
  }


}
