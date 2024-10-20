
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';
const API_URL = GlobalComponent.API_URL;
const PROJET = GlobalComponent.Projet;
@Injectable({
  providedIn: 'root'
})
export class ProjetService {

  constructor(private http: HttpClient) { }
  public getProjetsByDepartement(offset: number, pageSize: number, field: string,idDepartement:any): Observable<any> {
    return this.http.get(API_URL+PROJET+"all/"+offset+"/"+pageSize+"/"+field+"/"+idDepartement);
  }
  public getProjetById(projectId:any): Observable<any> {
    return this.http.get(API_URL+PROJET+"findById/"+projectId);
  }
  public addProjet(data:any):Observable<any> {
    return this.http.post(API_URL+PROJET+"add",data);
  }
  public editProjet(idProjet:number,data:any):Observable<any> {
    return this.http.put(API_URL+PROJET+"edit/"+idProjet,data);
  }
  public deleteProjet(idProjet:number):Observable<any> {
    return this.http.delete(API_URL+PROJET+"delete/"+idProjet);
  }
  public getUsersAssignToChef(): Observable<any> {
    return this.http.get(API_URL+"user/assignToChef");
  }
  public getActifsInProject(projectId:any): Observable<any> {
    return this.http.get(API_URL+PROJET+projectId+"/actifs-in-project");
  }
  public getActifsNotInProject(projectId:any): Observable<any> {
    return this.http.get(API_URL+PROJET+projectId+"/actifs-not-in-project");
  }

  public assignActifsToProject(data:any,projectId:any):Observable<any> {
    return this.http.post(API_URL+PROJET+"assignActifs/"+projectId,data);
  }
  public removeActifFromProject(projetId:any,actifId:any):Observable<any> {
    return this.http.delete(API_URL+PROJET+"actif/"+projetId+"/remove-actif/"+actifId);
  }
  getProjetRisque(projetId: any): Observable<number> {
    return this.http.get<number>(API_URL+PROJET+"risque/"+projetId);
  }
  getRiskMatrix(projetId: any): Observable<any> {
    return this.http.get<any>(API_URL+PROJET+"risque-matrix/"+projetId);
  }
}
