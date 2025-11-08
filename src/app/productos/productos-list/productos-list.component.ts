import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../shared/service/productos.service';
import { Producto } from '../../shared/models/producto.model';
import { ValoresComunes } from '../../shared/models/valores-comunes.model';
// 1. Importamos forkJoin y finalize de RxJS
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

// 2. Interfaz para nuestro objeto de "display" (más limpio)
interface ProductoDisplay extends Producto {
  nombreTipoProducto: string;
  urlImagen: string;
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
  isLoading = true; // 3. Añadimos flag de carga

  // Usaremos este array para el *ngFor
  productosDisplay: ProductoDisplay[] = [];
  
  // Estos arrays ahora solo guardan los datos de "traducción"
  private tipoProductoOpciones: { id: number; nombre: string }[] = [];
  private imagenOpciones: { id: number; url: string }[] = []; // 'url' es más claro

  constructor(private service: ProductosService) {}

  ngOnInit(): void {
    // 4. SOLUCIÓN A LA CONDICIÓN DE CARRERA
    // Usamos forkJoin para cargar AMBOS (tipos e imágenes) en paralelo.
    // SOLO cuando ambos hayan terminado, cargamos los productos.
    this.isLoading = true;
    forkJoin({
      tipos: this.service.getByTabla('REP002'),
      imagenes: this.service.getByTabla('REP003'),
    }).subscribe({
      next: (data) => {
        // Mapeamos los datos de "traducción" primero
        this.tipoProductoOpciones = data.tipos.map((v) => ({
          id: Number(v.clave1),
          nombre: v.valor1,
        }));
        
        // (Corregido: 'valor2' parece ser la URL, lo renombramos a 'url')
        this.imagenOpciones = data.imagenes.map((v) => ({
          id: Number(v.clave1),
          url: v.valor2, // Asumimos que valor2 es la URL
        }));
        
        // 5. AHORA SÍ, cargamos los productos
        this.cargarProducto();
      },
      error: (err) => {
        console.error('Error al cargar datos iniciales', err);
        this.isLoading = false;
        // Aquí podrías mostrar un error en la UI
      }
    });
  }

  cargarProducto(): void {
    this.service.getAll()
      .pipe(finalize(() => this.isLoading = false)) // Se ejecuta al final (next o error)
      .subscribe({
        next: (data: Producto[]) => {
          // 6. MEJORA DE RENDIMIENTO
          // "Pre-procesamos" el array.
          // Convertimos IDs a nombres/URLs UNA SOLA VEZ aquí.
          this.productosDisplay = data.map(producto => ({
            ...producto,
            nombreTipoProducto: this.getNombreTipoProducto(producto.tipoProducto),
            urlImagen: this.getURLImagen(producto.idImagen),
            estiloTipoProducto: this.getEstiloTipoProducto(producto.tipoProducto)
          }));
        },
        error: (err) => console.error('Error al cargar productos', err),
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro de eliminar este registro?')) {
      this.isLoading = true; // Mostramos spinner mientras se borra
      this.service.delete(id).subscribe({
        next: () => {
          // En lugar de recargar todo, podríamos solo filtrar el array
          // this.productosDisplay = this.productosDisplay.filter(p => p.idProducto !== id);
          // Pero recargar asegura consistencia con la DB
          this.cargarProducto(); 
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.isLoading = false;
        }
      });
    }
  }

  // --- FUNCIONES HELPER (AHORA PRIVADAS O INTERNAS) ---
  // Estas funciones ahora se llaman 1 sola vez (en cargarProducto)
  // y no en cada ciclo de detección de cambios.

  private getNombreTipoProducto(id: number): string {
    const unidad = this.tipoProductoOpciones.find((u) => u.id === id);
    return unidad ? unidad.nombre : 'No definido';
  }

  // 7. Hacemos la función segura para IDs opcionales (id?: number)
  private getURLImagen(id?: number): string {
    if (!id) {
      return 'https://i.ibb.co/wZTGwSjp/IMG-20250629-WA0000.jpg'; // Default
    }
    const unidad = this.imagenOpciones.find((u) => u.id === id);
    return unidad ? unidad.url : 'https://i.ibb.co/wZTGwSjp/IMG-20250629-WA0000.jpg'; // Default si no lo encuentra
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