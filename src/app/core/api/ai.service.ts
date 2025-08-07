import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AiAnalysis {
  riepilogo: string;
  rischiPotenziali: string;
  classificazioneMedDRA: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) { }

  analyzeReport(reportId: string): Observable<AiAnalysis> {
    return this.http.post<AiAnalysis>(`${this.apiUrl}/analyze`, { reportId });
  }
}
