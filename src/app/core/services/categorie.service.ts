import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';

const API_URL = GlobalComponent.API_URL;
const CATEGORIE = GlobalComponent.CATEGORIE;

@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  constructor(private http: HttpClient) { }
  public getCategories(): Observable<any> {
    return this.http.get(API_URL+CATEGORIE+"all");
  }
  public addCategorie(data:any):Observable<any> {
    return this.http.post(API_URL+CATEGORIE+"add",data);
  }
  public editCategorie(idCategorie:number,data:any):Observable<any> {
    return this.http.put(API_URL+CATEGORIE+"edit/"+idCategorie,data);
  }
  public removeCategorie(idCategorie:number):Observable<any> {
    return this.http.delete(API_URL+CATEGORIE+"delete/"+idCategorie);
  }
}
