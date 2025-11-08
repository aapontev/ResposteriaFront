import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importamos ReactiveFormsModule y Validators
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { IngredientesService } from '../../shared/service/ingredientes.service';
import { Ingrediente } from '../../shared/models/ingrediente.model';
// 2. Importamos finalize
import { finalize } from 'rxjs/operators';
import { ValoresComunesService } from '../../shared/service/valores-comunes.service';

@Component({
  selector: 'app-ingredientes-form',
  standalone: true,
  // 3. Reemplazamos FormsModule con ReactiveFormsModule
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ingredientes-form.component.html',
})
export class IngredientesFormComponent implements OnInit {
  id?: number;
  ingredienteForm: FormGroup<IngredienteForm>; // 4. FormGroup con tipado fuerte
  unidadMedidaOpciones: { id: number; nombre: string }[] = [];

  // 5. Estados de UI
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    private service: IngredientesService,
    private valoresComunesService: ValoresComunesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder // 6. Inyectamos FormBuilder
  ) {
    // 7. Definimos el formulario en el constructor
    this.ingredienteForm = this.fb.group({
      idIngrediente: [null as number | null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      // 8. Añadimos validadores de número
      stock: [0 as number | null, [Validators.required, Validators.min(0)]],
      unidadMedida: [null as number | null, Validators.required],
      costoUnitario: [0 as number | null, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    // 9. Arreglamos la condición de carrera
    // Siempre cargamos el dropdown
    this.cargarUnidadesDeMedida(); 
    
    // Y SOLO si hay un ID, cargamos el ingrediente
    if (this.id) {
      this.cargarIngrediente();
    }
  }

  cargarIngrediente(): void {
    this.isLoading = true;
    this.service.getById(this.id!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          // 10. Usamos patchValue para rellenar el formulario
          this.ingredienteForm.patchValue(data);
        },
        error: (err) => {
          console.error('Error al cargar ingrediente', err);
          this.errorMessage = 'No se pudo cargar el ingrediente.';
        }
      });
  }

  cargarUnidadesDeMedida(): void {
    this.valoresComunesService.getByTabla('REP001').subscribe({
      next: (data) => {
        this.unidadMedidaOpciones = data.map((v) => ({
          id: Number(v.clave1),
          nombre: v.valor1,
        }));
        // 11. Seteamos el valor por defecto SOLO si es NUEVO (!this.id)
        if (!this.id && this.unidadMedidaOpciones.length > 0) {
          this.ingredienteForm.patchValue({ 
            unidadMedida: this.unidadMedidaOpciones[0].id 
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar unidades de medida', err);
        this.errorMessage = 'No se pudieron cargar las unidades de medida.';
      },
    });
  }

  guardar(): void {
    // 12. Validamos el formulario
    if (this.ingredienteForm.invalid) {
      this.ingredienteForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const rawValue = this.ingredienteForm.getRawValue();

    // 13. Mapeo seguro de tipos (soluciona error de 'null' vs 'undefined')
    const ingredienteParaGuardar: Ingrediente = {
      nombre: rawValue.nombre!,
      stock: rawValue.stock!,
      unidadMedida: rawValue.unidadMedida!,
      costoUnitario: rawValue.costoUnitario!,
      idIngrediente: rawValue.idIngrediente ? rawValue.idIngrediente : undefined,
    };

    const saveOperation = this.id
      ? this.service.update(this.id, ingredienteParaGuardar)
      : this.service.create(ingredienteParaGuardar);

    // 14. Manejo de error y estado 'saving'
    saveOperation
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/ingredientes']);
        },
        error: (err) => {
          console.error('Error al guardar', err);
          this.errorMessage = 'Error al guardar el ingrediente.';
        }
      });
  }

  // 15. Helper para el HTML
  get f() {
    return this.ingredienteForm.controls;
  }
}

// 16. Interfaz de tipado fuerte para el FormGroup
interface IngredienteForm {
  idIngrediente: import('@angular/forms').FormControl<number | null>;
  nombre: import('@angular/forms').FormControl<string | null>;
  stock: import('@angular/forms').FormControl<number | null>;
  unidadMedida: import('@angular/forms').FormControl<number | null>;
  costoUnitario: import('@angular/forms').FormControl<number | null>;
}