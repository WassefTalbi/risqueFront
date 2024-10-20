import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';
import { Observable } from 'rxjs';
const API_URL = GlobalComponent.API_URL;
const ANALYTIC = GlobalComponent.ANALYTIC;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }

  getAnalyticsCounts(): Observable<any> {
    return this.http.get(API_URL+ANALYTIC+"counts");
  }
  getRisqueImpacts(): Observable<any[]> {
    return this.http.get<any[]>(API_URL+ANALYTIC+"risque-impacts");
  }
  getProjetStatusCounts(): Observable<any[]> {
    
    return this.http.get<any[]>(API_URL+ANALYTIC+"projets-status");
  }

}
