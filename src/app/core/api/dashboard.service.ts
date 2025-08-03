import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardSummary {
  totalReports: number;
  reportsBySeverity: { _id: string, count: number }[];
  top5Drugs: { _id: string, count: number }[];
  last5Reports: {
    farmaco: { nomeCommerciale: string };
    reazione: { gravita: string };
    createdAt: string;
  }[];
  reportLocations: {
    localita: { coordinates: [number, number] };
    farmaco: { nomeCommerciale: string }
    reazione: { gravita: string };
  }[];
  totalGraveReports: number;
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
