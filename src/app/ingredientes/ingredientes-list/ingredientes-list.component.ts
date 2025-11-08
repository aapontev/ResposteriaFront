import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IngredientesService } from '../../shared/service/ingredientes.service';
import { Ingrediente } from '../../shared/models/ingrediente.model';
import { ValoresComunes } from '../../shared/models/valores-comunes.model';
import { finalize } from 'rxjs/operators';

// 1. Interfaz para el objeto de "display" (más rápido)
interface IngredienteDisplay extends Ingrediente {
  nombreUnidadMedida: string;
}

@Component({
  selector: 'app-ingredientes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ingredientes-list.component.html',
})
export class IngredientesListComponent implements OnInit {
  titulo: String = 'Lista de Ingredientes';
  
  // 2. Array para el *ngFor y flag de carga
  ingredientesDisplay: IngredienteDisplay[] = [];
  isLoading = true;
  
  // 3. Array privado para "traducción"
  private unidadMedidaOpciones: { id: number; nombre: string }[] = [];

  constructor(private service: IngredientesService) {}

  ngOnInit(): void {
    // 4. CORRECCIÓN DE CONDICIÓN DE CARRERA:
    // Primero cargamos las unidades de medida
    this.isLoading = true;
    this.service.getByTabla('REP001').subscribe({
      next: (data) => {
        // 5. Guardamos las opciones de "traducción"
        this.unidadMedidaOpciones = data.map(v => ({
          id: Number(v.clave1),
          nombre: v.valor1
        }));
        
        // 6. Y SÓLO AHORA cargamos los ingredientes
        this.cargarIngredientes();
      },
      error: (err) => {
        console.error('Error al cargar unidades de medida', err);
        this.isLoading = false; // Detenemos la carga si falla
      }
    });
  }
  
  cargarIngredientes(): void {
    this.service.getAll()
      .pipe(finalize(() => this.isLoading = false)) // 7. Se ejecuta al final
      .subscribe({
        next: (data) => {
          // 8. MEJORA DE RENDIMIENTO:
          // Procesamos el array UNA SOLA VEZ aquí
          this.ingredientesDisplay = data.map(ingrediente => ({
            ...ingrediente,
            // Llamamos la función de 'traducción' aquí, no en el HTML
            nombreUnidadMedida: this.getNombreUnidad(ingrediente.unidadMedida)
          }));
        },
        error: (err) => console.error('Error al cargar ingredientes', err)
    });
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro de eliminar este registro?')) {
      this.isLoading = true; // 9. Mostramos feedback de carga
      this.service.delete(id).subscribe({
        next: () => {
          // Recargamos la lista (esto ya maneja el finalize de isLoading)
          this.cargarIngredientes(); 
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          this.isLoading = false;
        }
      });
    }
  }
  
  // 10. Función de "traducción" ahora es privada
  private getNombreUnidad(id: number): string {
    const unidad = this.unidadMedidaOpciones.find(u => u.id === id);
    return unidad ? unidad.nombre : 'Sin unidad';
  }
}