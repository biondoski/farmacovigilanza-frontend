import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Farmaco {
  nomeCommerciale: string;
  principioAttivo?: string;
  lotto?: string;
  dosaggio?: string;
  viaSomministrazione?: string;
  dataInizioTerapia?: string;
  dataFineTerapia?: string;
  indicazioneUso?: string;
}

export interface Report {
  _id: string;
  tipoSegnalazione: 'Sanitario' | 'Cittadino';
  paziente: {
    iniziali?: string;
    dataNascita?: string;
    eta: number;
    sesso: 'M' | 'F';
    peso?: number;
    altezza?: number;
  };
  reazione: {
    descrizione: string;
    dataInizio: string;
    dataFine?: string;
    esito: 'Guarigione completa' | 'Guarigione con postumi' | 'In via di guarigione' | 'Persistenza della reazione' | 'Decesso' | 'Sconosciuto';
    gravita: {
      isGrave: boolean;
      decesso?: boolean;
      ospedalizzazione?: boolean;
      pericoloVita?: boolean;
      invalidita?: boolean;
      anomaliaCongenita?: boolean;
      altraGravita?: boolean;
    };
  };
  farmaciSospetti: Farmaco[];
  farmaciConcomitanti?: Farmaco[];
  segnalatore: {
    qualifica: string;
    nome?: string;
    cognome?: string;
    email?: string;
    struttura?: string;
  };
  storiaClinica?: string;
  submittedBy?: { name: string; email: string; };
  createdAt?: string;
  localita?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export type ReportPayload = Omit<Report, '_id' | 'submittedBy' | 'createdAt'>;

export interface PaginatedReports {
  reports: Report[];
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) { }

  getReports(page: number, filters: any, sort: { sortBy: string, sortOrder: string }, limit: number = 10): Observable<PaginatedReports> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', sort.sortBy)
      .set('sortOrder', sort.sortOrder);

    if (filters.farmaco) params = params.set('farmaco', filters.farmaco);
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
