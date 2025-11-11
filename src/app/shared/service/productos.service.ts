import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model'; 
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrlBase = 'http://192.168.100.30:8090';
  private apiUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}
  
  // 2. Método para obtener la URL base (útil para la lista)
  getApiUrlBase(): string {
    return this.apiUrlBase;
  }

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
  uploadImagen(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/image`, formData);
  }
}
