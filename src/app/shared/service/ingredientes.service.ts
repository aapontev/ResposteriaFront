import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingrediente } from '../models/ingrediente.model';
import { ValoresComunes } from '../models/valores-comunes.model';

@Injectable({ 
  providedIn: 'root' 
})
export class IngredientesService {
  private apiUrl = 'http://192.168.100.30:8090/api/ingredientes';
  private apiUrlValores = 'http://192.168.100.30:8090/api/valorescomunes';

  constructor(private http: HttpClient) {}
 
   getAll(): Observable<Ingrediente[]> {
     return this.http.get<Ingrediente[]>(this.apiUrl);
   }
 
   getById(id: number): Observable<Ingrediente> {
     return this.http.get<Ingrediente>(`${this.apiUrl}/${id}`);
   }
 
   getByUnidadMedida(id: number): Observable<Ingrediente[]> {
     return this.http.get<Ingrediente[]>(`${this.apiUrl}/unidadMedida/${id}`);
   }
 
   create(valor: Ingrediente): Observable<Ingrediente> {
     return this.http.post<Ingrediente>(this.apiUrl, valor);
   }
 
   update(id: number, valor: Ingrediente): Observable<Ingrediente> {
     return this.http.put<Ingrediente>(`${this.apiUrl}/${id}`, valor);
   }
 
   delete(id: number): Observable<void> {
     return this.http.delete<void>(`${this.apiUrl}/${id}`);
   }

   getByTabla(id: string): Observable<ValoresComunes[]> {
    return this.http.get<ValoresComunes[]>(`${this.apiUrlValores}/codTabla/${id}`);
  }
}
