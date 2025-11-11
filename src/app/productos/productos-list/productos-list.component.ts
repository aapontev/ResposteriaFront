import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../shared/service/productos.service';
import { Producto } from '../../shared/models/producto.model';
import { finalize } from 'rxjs/operators';
import { ValoresComunesService } from '../../shared/service/valores-comunes.service'; // Importar

// Interfaz actualizada
interface ProductoDisplay extends Producto {
  nombreTipoProducto: string;
  urlImagenCompleta: string; // URL completa para mostrar
  estiloTipoProducto: string;
}

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './productos-list.component.html',
})
export class ProductosListComponent implements OnInit {
  titulo: String = 'Lista de Productos';
  isLoading = true; 
  productosDisplay: ProductoDisplay[] = [];
  
  private tipoProductoOpciones: { id: number; nombre: string }[] = [];
  // imagenOpciones ya no se usa
  private apiUrlBase: string;

  constructor(
    private service: ProductosService,
    private valoresComunesService: ValoresComunesService // Inyectar
  ) {
    this.apiUrlBase = this.service.getApiUrlBase(); // Obtener URL base
  }

  ngOnInit(): void {
    this.isLoading = true;
    
    // forkJoin ahora solo carga los tipos
    this.valoresComunesService.getByTabla('REP002').subscribe({
      next: (dataTipos) => {
        this.tipoProductoOpciones = dataTipos.map((v) => ({
          id: Number(v.clave1),
          nombre: v.valor1,
        }));
        
        // Cuando los tipos estén listos, cargar productos
        this.cargarProducto();
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales', err);
        this.isLoading = false;
      }
    });
  }

  cargarProducto(): void {
    this.service.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data: Producto[]) => {
          this.productosDisplay = data.map(producto => ({
            ...producto,
            nombreTipoProducto: this.getNombreTipoProducto(producto.tipoProducto),
            // Construir la URL completa de la imagen
            urlImagenCompleta: this.getURLImagen(producto.imagenUrl),
            estiloTipoProducto: this.getEstiloTipoProducto(producto.tipoProducto)
          }));
        },
        error: (err) => console.error('Error al cargar productos', err),
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro de eliminar este registro?')) {
      this.isLoading = true;
      this.service.delete(id).subscribe({
        next: () => {
          this.cargarProducto(); 
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.isLoading = false;
        }
      });
    }
  }

  private getNombreTipoProducto(id: number): string {
    const unidad = this.tipoProductoOpciones.find((u) => u.id === id);
    return unidad ? unidad.nombre : 'No definido';
  }

  // MODIFICADO: Esta función ahora recibe la URL parcial
  private getURLImagen(urlParcial?: string): string {
    const defaultImage = 'https://i.ibb.co/wZTGwSjp/IMG-20250629-WA0000.jpg';
    
    if (!urlParcial) {
      return defaultImage;
    }
    // Si la URL ya es completa (ej. de otro sitio), usarla
    if (urlParcial.startsWith('http')) {
      return urlParcial;
    }
    // Si es una ruta local, construirla con la URL base de la API
    return `${this.apiUrlBase}${urlParcial}`;
  }

  private getEstiloTipoProducto(tipo: number): string {
    switch (tipo) {
      case 1: return 'bg-pastel-rosa';
      case 2: return 'bg-pastel-amarillo';
      case 3: return 'bg-pastel-verde';
      default: return 'bg-pastel-gris';
    }
  }
}