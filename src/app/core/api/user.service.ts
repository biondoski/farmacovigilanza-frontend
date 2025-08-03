import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: 'Operatore' | 'Analista' | 'Admin';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(this.apiUrl);
  }

  createUser(userData: any): Observable<AppUser> {
    return this.http.post<AppUser>(this.apiUrl, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUser(id: string, userData: Partial<AppUser>): Observable<AppUser> {
    return this.http.put<AppUser>(`${this.apiUrl}/${id}`, userData);
  }
}
