import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductosService } from '../../shared/service/productos.service';
import { Producto } from '../../shared/models/producto.model';
import { ValoresComunes } from '../../shared/models/valores-comunes.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-productos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './productos-form.component.html',
})
export class ProductosFormComponent implements OnInit {
  id?: number;
  productoForm: FormGroup<ProductoForm>;
  tipoProductoOpciones: { id: number; nombre: string }[] = [];
  imagenesOpciones: { id: number; nombre: string }[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    private service: ProductosService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.productoForm = this.fb.group({
      idProducto: [null as number | null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0 as number | null, [Validators.required, Validators.min(0.01)]],
      tipoProducto: [null as number | null, Validators.required],
      descripcion: ['', Validators.required],
      // CORRECCIÓN: 'idImagen' es opcional en tu modelo (idImagen?: number),
      // por lo que quitamos Validators.required.
      idImagen: [null as number | null],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.cargarDropdowns();

    if (this.id) {
      this.cargarProducto();
    }
  }

  cargarProducto(): void {
    this.isLoading = true;
    this.service.getById(this.id!)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.productoForm.patchValue(data);
        },
        error: (err) => {
          console.error('Error al cargar producto', err);
          this.errorMessage = 'No se pudo cargar el producto. Intente de nuevo.';
        }
      });
  }

  guardar(): void {
    // Verificamos la validez del formulario
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const rawValue = this.productoForm.getRawValue();

    // ==================================================================
    // CORRECCIÓN (Línea 92)
    // Mapeamos manualmente el valor 'raw' del formulario al modelo 'Producto'.
    // Esto soluciona el error 'Type... is not assignable to type 'Producto''.
    //
    // Usamos '!' (non-null assertion) para campos requeridos,
    // y convertimos 'null' a 'undefined' para campos opcionales.
    // ==================================================================
    const productoParaGuardar: Producto = {
      // Campos requeridos (sabemos que no son nulos por los Validators)
      nombre: rawValue.nombre!,
      precio: rawValue.precio!,
      tipoProducto: rawValue.tipoProducto!,
      descripcion: rawValue.descripcion!,

      // Campos opcionales (el modelo espera 'number | undefined', no 'number | null')
      idProducto: rawValue.idProducto ? rawValue.idProducto : undefined,
      idImagen: rawValue.idImagen ? rawValue.idImagen : undefined,
    };

    const saveOperation = this.id
      ? this.service.update(this.id, productoParaGuardar)
      : this.service.create(productoParaGuardar);

    saveOperation
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          this.router.navigate(['/productos']);
        },
        error: (err) => {
          console.error('Error al guardar producto', err);
          this.errorMessage = 'Ocurrió un error al guardar. Por favor, revise los datos.';
        }
      });
  }

  cargarDropdowns(): void {
    // Cargar Tipos de Producto
    this.service.getByTabla('REP002').subscribe({
      next: (data) => {
        this.tipoProductoOpciones = data.map((v) => ({
          id: Number(v.clave1),
          nombre: v.valor1,
        }));
        if (!this.id && this.tipoProductoOpciones.length > 0) {
          this.productoForm.patchValue({ tipoProducto: this.tipoProductoOpciones[0].id });
        }
      },
      error: (err) => console.error('Error al cargar tipos de producto', err),
    });

    // Cargar Imágenes
    this.service.getByTabla('REP003').subscribe({
      next: (data) => {
        this.imagenesOpciones = data.map((v) => ({
          id: Number(v.clave1),
          nombre: v.valor1,
        }));
        if (!this.id && this.imagenesOpciones.length > 0) {
          // No seteamos valor por defecto para 'idImagen' ya que es opcional
        }
      },
      error: (err) => console.error('Error al cargar imágenes', err),
    });
  }

  // Helper para acceder fácilmente a los controles del formulario desde el HTML
  get f() {
    return this.productoForm.controls;
  }
}

// Interfaz para el tipado fuerte del FormGroup
// Esta interfaz sigue siendo correcta
interface ProductoForm {
  idProducto: import('@angular/forms').FormControl<number | null>;
  nombre: import('@angular/forms').FormControl<string | null>;
  precio: import('@angular/forms').FormControl<number | null>;
  tipoProducto: import('@angular/forms').FormControl<number | null>;
  descripcion: import('@angular/forms').FormControl<string | null>;
  idImagen: import('@angular/forms').FormControl<number | null>;
}