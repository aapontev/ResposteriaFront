import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Receta } from '../../shared/models/receta.model';
import { RecetasService } from '../../shared/service/recetas.service'; 
import { finalize } from 'rxjs/operators';

// 1. Interfaz para el objeto de "display" (más rápido)
interface RecetaDisplay extends Receta {
  productoNombre: string; // Nombre aplanado para la vista
}

@Component({
  selector: 'app-recetas-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recetas-list.component.html',
  styleUrls: ['./recetas-list.component.css'] // Puedes añadir estilos específicos si quieres
})
export class RecetasListComponent implements OnInit {
  titulo: String = 'Lista de Recetas';
  recetasDisplay: RecetaDisplay[] = [];
  isLoading = true;

  constructor(private service: RecetasService) {}

  ngOnInit(): void {
    this.cargarRecetas();
  }

  cargarRecetas(): void {
    this.isLoading = true;
    this.service.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          // 2. Pre-procesamos la lista para un binding más rápido
          this.recetasDisplay = data.map(receta => ({
            ...receta,
            // 3. Obtenemos el nombre del producto (asumiendo que viene anidado)
            productoNombre: receta.producto ? receta.producto.nombre : 'Sin producto'
          }));
        },
        error: (err) => {
          console.error('Error al cargar recetas', err);
          // Aquí deberías mostrar un mensaje de error en la UI
        }
      });
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro de eliminar esta receta? Se borrarán todos sus pasos e ingredientes.')) {
      this.isLoading = true;
      this.service.delete(id).subscribe({
        next: () => {
          this.cargarRecetas(); // Recargamos la lista
        },
        error: (err) => {
          console.error('Error al eliminar receta', err);
          this.isLoading = false;
        }
      });
    }
  }
}