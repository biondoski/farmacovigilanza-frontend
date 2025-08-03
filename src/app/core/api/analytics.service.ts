import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReactionStat {
  _id: string;
  conteggio: number;
}

export interface MonthlyTrend {
  _id: { anno: number; mese: number; };
  conteggio: number;
}

export interface DynamicAnalytics {
  reportsByDrug: { _id: string, count: number }[];
  reportsBySeverity: { _id: string, count: number }[];
}

export interface SymptomCorrelation {
  _id: [string, string];
  conteggio: number;
}

export interface HotLot {
  _id: string;
  segnalazioniTotali: number;
  segnalazioniGravi: number;
}

export interface AgeAnalysis {
  _id: number | string;
  conteggio: number;
}
export interface GenderAnalysis {
  _id: string;
  conteggio: number;
}
export interface DemographicAnalysis {
  byAge: AgeAnalysis[];
  byGender: GenderAnalysis[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) { }

  getReactionsByDrugAndAge(farmaco: string, etaMin: number, etaMax: number): Observable<ReactionStat[]> {
    const params = new HttpParams()
      .set('farmaco', farmaco)
      .set('etaMin', etaMin.toString())
      .set('etaMax', etaMax.toString());

    return this.http.get<ReactionStat[]>(`${this.apiUrl}/reactions-by-drug-age`, { params });
  }

  getMonthlyTrendByDrug(farmaco: string): Observable<MonthlyTrend[]> {
    const params = new HttpParams().set('farmaco', farmaco);
    return this.http.get<MonthlyTrend[]>(`${this.apiUrl}/monthly-trend`, { params });
  }

  runDynamicAnalysis(filters: any): Observable<DynamicAnalytics> {
    return this.http.post<DynamicAnalytics>(`${this.apiUrl}/dynamic`, { filters });
  }

  getReportsByDrug(): Observable<ReactionStat[]> {
    return this.http.get<ReactionStat[]>(`${this.apiUrl}/reports-by-drug`);
  }

  getHotLotsByDrug(farmaco: string): Observable<HotLot[]> {
    const params = new HttpParams().set('farmaco', farmaco);
    return this.http.get<HotLot[]>(`${this.apiUrl}/hot-lots`, { params });
  }

  getSymptomCorrelation(filters: any): Observable<SymptomCorrelation[]> {
    return this.http.post<SymptomCorrelation[]>(`${this.apiUrl}/symptom-correlation`, { filters });
  }

  getDemographicAnalysis(filters: any): Observable<DemographicAnalysis> {
    return this.http.post<DemographicAnalysis>(`${this.apiUrl}/demographics`, { filters });
  }
}
