import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  totalReports: number;
  reportsBySeverity: { _id: string, count: number }[];
  top5Drugs: { _id: string, count: number }[];
  last5Reports: {
    farmaciSospetti: { nomeCommerciale: string }[];
    reazione: { esito: string };
    createdAt: string;
  }[];
  reportLocations: {
    localita: { coordinates: [number, number] };
    farmaciSospetti: { nomeCommerciale: string }[];
    reazione: { gravita: { isGrave: boolean } };
  }[];
  totalGraveReports: number;
  reportsBySource: { _id: string, count: number }[];
  reportsByGender: { _id: string, count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }
}
