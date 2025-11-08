import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ingrediente } from '../models/ingrediente.model';
import { ValoresComunes } from '../models/valores-comunes.model';
import { environment } from '../../../environment/environment';

@Injectable({ 
  providedIn: 'root' 
})
export class IngredientesService {
  private apiUrl = `${environment.apiUrl}/ingredientes`;

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

}
