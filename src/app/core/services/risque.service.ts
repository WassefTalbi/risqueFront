import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalComponent } from 'src/app/global-component';
const API_URL = GlobalComponent.API_URL;
const ACTIF = GlobalComponent.ACTIF;
const RISQUE = GlobalComponent.RISQUE;
@Injectable({
  providedIn: 'root'
})
export class RisqueService {

  constructor(private http: HttpClient) { }
  public getActifById(idActif:any): Observable<any> {
    return this.http.get(API_URL+ACTIF+"findById/"+idActif);
  }
  public getRisqueById(idRisque:any): Observable<any> {
    return this.http.get(API_URL+RISQUE+"findById/"+idRisque);
  }
  public addRisque(data:any):Observable<any> {
    return this.http.post(API_URL+RISQUE+"add",data);
  }
  public editRisque(idRisque:number,data:any):Observable<any> {
    return this.http.put(API_URL+RISQUE+"edit/"+idRisque,data);
  }
  public removeRisque(idRisque:number):Observable<any> {
    return this.http.delete(API_URL+RISQUE+"delete/"+idRisque);
  }
}
