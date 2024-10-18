import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';

const API_URL = GlobalComponent.API_URL;
const VULNERABILITE = GlobalComponent.VULNERABILITE;

@Injectable({
  providedIn: 'root'
})
export class VulnerabiliteService {

  constructor(private http: HttpClient) { }

  public getAllVulnerabilite(): Observable<any> {
    return this.http.get(API_URL+VULNERABILITE+"all");
  }
  public getVulnerabiliteByActif(idActif:any): Observable<any> {
    return this.http.get(API_URL+VULNERABILITE+"of-actif/"+idActif);
  }
  public addVulnerabilite(data:any):Observable<any> {
    
    return this.http.post(API_URL+VULNERABILITE+"add",data);
  }
  public addMenace(data:any):Observable<any> {
    return this.http.post(API_URL+VULNERABILITE+"add-menace",data);
  }
  public removeMenaceFromVulnerabilite(vulnerabiliteId:any,menaceId:any):Observable<any> {
    return this.http.delete(API_URL+VULNERABILITE+vulnerabiliteId+"/remove-menace/"+menaceId);
  }
  public removeVulnerabiliteFromActif(actifId:any,vulnerabiliteId:any):Observable<any> {
    return this.http.delete(API_URL+VULNERABILITE+actifId+"/remove-vulnerabilite/"+vulnerabiliteId);
  }
}
