import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';

const API_URL = GlobalComponent.API_URL;
const ACTIF = GlobalComponent.ACTIF;
 
@Injectable({
  providedIn: 'root'
})
export class ActifService {

  constructor(private http: HttpClient) { }
  public getActifs(): Observable<any> {
    return this.http.get(API_URL+ACTIF+"all");
  }
  public getActifsByCategorie(idCategorie:any): Observable<any> {
    return this.http.get(API_URL+ACTIF+"allByCategorie/"+idCategorie);
  }
  public getActifById(idActif:any): Observable<any> {
    return this.http.get(API_URL+ACTIF+"findById/"+idActif);
  }
  public addActif(data:any):Observable<any> {
    return this.http.post(API_URL+ACTIF+"add",data);
  }
  public editActif(idActif:any,data:any):Observable<any> {
    return this.http.put(API_URL+ACTIF+"edit/"+idActif,data);
  }
  public removeActif(idActif:number):Observable<any> {
    return this.http.delete(API_URL+ACTIF+"delete/"+idActif);
  }
} 
