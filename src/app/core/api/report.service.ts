import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaginatedReports {
  reports: Report[];
  totalPages: number;
  currentPage: number;
}

export interface Report {
  _id: string;
  farmaco: { nomeCommerciale: string; principioAttivo: string; lotto?: string };
  paziente: { eta: number; sesso: string; };
  reazione: { descrizione: string; gravita: string; };
  submittedBy?: { name: string; email: string; };
  createdAt?: string;
  localita?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export type ReportPayload = Omit<Report, '_id'>;

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

  getReports(page: number, filters: { farmaco?: string, gravita?: string, dataDa?: string, dataA?: string }, sort: { sortBy: string, sortOrder: string }): Observable<PaginatedReports> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '10')
      .set('sortBy', sort.sortBy)
      .set('sortOrder', sort.sortOrder);

    if (filters.farmaco) params = params.set('farmaco', filters.farmaco);
    if (filters.gravita) params = params.set('gravita', filters.gravita);
    if (filters.dataDa) params = params.set('dataDa', filters.dataDa);
    if (filters.dataA) params = params.set('dataA', filters.dataA);

    return this.http.get<PaginatedReports>(this.apiUrl, { params });
  }

  getReportById(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`);
  }

  createReport(reportData: ReportPayload): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, reportData);
  }

  updateReport(id: string, reportData: Partial<ReportPayload>): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/${id}`, reportData);
  }

  exportReports(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob'
    });
  }
}
