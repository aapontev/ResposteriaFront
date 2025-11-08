import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ValoresComunes } from '../models/valores-comunes.model';

@Injectable({
  providedIn: 'root'
})
export class ValoresComunesService {
  private apiUrl = 'http://192.168.100.30:8090/api/valorescomunes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ValoresComunes[]> {
    return this.http.get<ValoresComunes[]>(this.apiUrl);
  }

  getById(id: number): Observable<ValoresComunes> {
    return this.http.get<ValoresComunes>(`${this.apiUrl}/${id}`);
  }

  getByTabla(id: string): Observable<ValoresComunes[]> {
    return this.http.get<ValoresComunes[]>(`${this.apiUrl}/codTabla/${id}`);
  }

  create(valor: ValoresComunes): Observable<ValoresComunes> {
    return this.http.post<ValoresComunes>(this.apiUrl, valor);
  }

  update(id: number, valor: ValoresComunes): Observable<ValoresComunes> {
    return this.http.put<ValoresComunes>(`${this.apiUrl}/${id}`, valor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
