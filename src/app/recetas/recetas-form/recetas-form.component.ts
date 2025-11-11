import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';

// Models
import { Receta } from '../../shared/models/receta.model';
import { Producto } from '../../shared/models/producto.model';
import { Ingrediente } from '../../shared/models/ingrediente.model';
import { RecetaPasos } from '../../shared/models/recetaPasos.model';
import { RecetaIngredientes } from '../../shared/models/recetaIngredientes.model';

// Services
import { RecetasService } from '../../shared/service/recetas.service';
import { ProductosService } from '../../shared/service/productos.service';
import { IngredientesService } from '../../shared/service/ingredientes.service';

@Component({
  selector: 'app-recetas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './recetas-form.component.html',
  styleUrls: ['./recetas-form.component.css'],
})
export class RecetasFormComponent implements OnInit {
  id?: number;
  recetaForm: FormGroup;

  productosOpciones: Producto[] = [];
  ingredientesOpciones: Ingrediente[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  costoTotalReceta: number = 0;
  
  // 1. AÑADIR: Variable para la URL base
  apiUrlBase: string;

  constructor(
    private fb: FormBuilder,
    private service: RecetasService,
    private productosService: ProductosService,
    private ingredientesService: IngredientesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // 2. AÑADIR: Obtener la URL base del servicio
    this.apiUrlBase = this.productosService.getApiUrlBase();

    this.recetaForm = this.fb.group({
      idReceta: [undefined as number | undefined],
      nombre: ['', Validators.required],
      descripcion: [''],
      tiempoPrep: [0, [Validators.required, Validators.min(1)]],
      producto: [undefined as Producto | undefined, Validators.required],
      pasos: this.fb.array([]),
      ingredientes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarDropdowns();
    if (this.id) {
      this.cargarReceta();
    }

    this.ingredientes.valueChanges.subscribe(() => {
      this.calcularCostoTotal();
    });
  }

  cargarDropdowns(): void {
    this.isLoading = true;
    forkJoin({
      productos: this.productosService.getAll(),
      ingredientes: this.ingredientesService.getAll(),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.productosOpciones = data.productos;
          this.ingredientesOpciones = data.ingredientes;
        },
        error: (err) => {
          console.error('Error al cargar dropdowns', err);
          this.errorMessage =
            'No se pudieron cargar los productos o ingredientes.';
        },
      });
  }

  cargarReceta(): void {
    this.isLoading = true;
    this.service
      .getById(this.id!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (receta) => {
          this.recetaForm.patchValue({
            idReceta: receta.idReceta,
            nombre: receta.nombre,
            descripcion: receta.descripcion,
            tiempoPrep: receta.tiempoPrep,
            producto:
              this.productosOpciones.find(
                (p) => p.idProducto === receta.producto.idProducto
              ) || undefined,
          });

          (receta.pasos || []).forEach((paso) => this.agregarPaso(paso));

          (receta.ingredientes || []).forEach((ing) => {
            if (!ing.ingrediente) {
              return;
            }
            const ingObj = this.ingredientesOpciones.find(
              (i) => i.idIngrediente === ing.ingrediente.idIngrediente
            );
            this.agregarIngrediente({
              ...ing,
              ingrediente: ingObj || undefined,
            });
          });

          this.calcularCostoTotal();
        },
        error: (err) => (this.errorMessage = 'No se pudo cargar la receta.'),
      });
  }

  // --- GETTERS para los FormArrays (para el HTML) ---
  get pasos(): FormArray {
    return this.recetaForm.get('pasos') as FormArray;
  }

  get ingredientes(): FormArray {
    return this.recetaForm.get('ingredientes') as FormArray;
  }
  
  // 3. AÑADIR: Getter para la URL de la imagen del producto
  get productoImagenUrl(): string | null {
    const producto = this.recetaForm.get('producto')?.value as Producto;
    if (!producto || !producto.imagenUrl) {
      return null; // O una imagen por defecto
    }
    if (producto.imagenUrl.startsWith('http')) {
      return producto.imagenUrl;
    }
    return `${this.apiUrlBase}${producto.imagenUrl}`;
  }


  // ... (métodos de Pasos e Ingredientes no cambian) ...
  nuevoPaso(paso?: RecetaPasos): FormGroup {
    return this.fb.group({
      id: [paso?.id || undefined],
      nroPaso: [paso?.nroPaso || this.pasos.length + 1, Validators.required],
      detallePaso: [paso?.detallePaso || '', Validators.required],
    });
  }

  agregarPaso(paso?: RecetaPasos): void {
    this.pasos.push(this.nuevoPaso(paso));
  }

  eliminarPaso(index: number): void {
    this.pasos.removeAt(index);
    this.pasos.controls.forEach((control, idx) => {
      control.get('nroPaso')?.setValue(idx + 1);
    });
  }

  nuevoIngrediente(
    ing?: Partial<RecetaIngredientes> & { ingrediente?: Ingrediente | undefined }
  ): FormGroup {
    return this.fb.group({
      id: [ing?.id || undefined],
      ingrediente: [ing?.ingrediente || undefined, Validators.required],
      cantidad: [
        ing?.cantidad || 0,
        [Validators.required, Validators.min(0.01)],
      ],
    });
  }

  agregarIngrediente(
    ing?: Partial<RecetaIngredientes> & { ingrediente?: Ingrediente | undefined }
  ): void {
    this.ingredientes.push(this.nuevoIngrediente(ing));
  }

  eliminarIngrediente(index: number): void {
    this.ingredientes.removeAt(index);
  }

  // 4. NUEVA FUNCIÓN: Calcular Costo Total
  private calcularCostoTotal(): void {
    let total = 0;
    for (const control of this.ingredientes.controls) {
      const ingrediente = control.get('ingrediente')?.value as Ingrediente;
      const cantidad = control.get('cantidad')?.value;

      if (ingrediente && cantidad > 0) {
        total += ingrediente.costoUnitario * cantidad;
      }
    }
    this.costoTotalReceta = total;
  }

  imprimirReceta(): void {
    window.print();
  }

  guardar(): void {
    if (this.recetaForm.invalid) {
      this.recetaForm.markAllAsTouched();
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const formValue = this.recetaForm.getRawValue();
    const recetaParaGuardar: Receta = formValue;

    const saveOperation = this.id
      ? this.service.update(this.id, recetaParaGuardar)
      : this.service.create(recetaParaGuardar);

    saveOperation.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => {
        this.router.navigate(['/recetas']);
      },
      error: (err) => {
        console.error('Error al guardar receta', err);
        this.errorMessage = 'Ocurrió un error al guardar la receta.';
      },
    });
  }
}