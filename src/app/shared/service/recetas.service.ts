import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.model';
import { ValoresComunes } from '../models/valores-comunes.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class RecetasService {
  private apiUrl = `${environment.apiUrl}/recetas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Receta[]> {
    return this.http.get<Receta[]>(this.apiUrl);
  }

  getById(id: number): Observable<Receta> {
    return this.http.get<Receta>(`${this.apiUrl}/${id}`);
  }

  create(valor: Receta): Observable<Receta> {
    return this.http.post<Receta>(this.apiUrl, valor);
  }

  update(id: number, valor: Receta): Observable<Receta> {
    return this.http.put<Receta>(`${this.apiUrl}/${id}`, valor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
