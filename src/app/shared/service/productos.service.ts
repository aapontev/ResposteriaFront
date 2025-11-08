import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model'; 
import { ValoresComunes } from '../models/valores-comunes.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://192.168.100.30:8090/api/productos';
  private apiUrlValores = 'http://192.168.100.30:8090/api/valorescomunes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  getByTipoProducto(id: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/tipoProducto/${id}`);
  }

  create(valor: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, valor);
  }

  update(id: number, valor: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, valor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByTabla(id: string): Observable<ValoresComunes[]> {
      return this.http.get<ValoresComunes[]>(`${this.apiUrlValores}/codTabla/${id}`);
    }
}
