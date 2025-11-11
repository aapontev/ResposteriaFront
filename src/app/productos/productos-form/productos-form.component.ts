import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl, // Importa FormControl
} from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductosService } from '../../shared/service/productos.service';
import { Producto } from '../../shared/models/producto.model';
import { finalize } from 'rxjs/operators';
import { ValoresComunesService } from '../../shared/service/valores-comunes.service'; // Importar

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
  // imagenesOpciones ya no se usa

  // Nuevas propiedades para la subida de archivos
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  apiUrlBase: string; // Para la vista previa

  constructor(
    private service: ProductosService,
    private valoresComunesService: ValoresComunesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.apiUrlBase = service.getApiUrlBase(); // Guardar la URL base
    this.productoForm = this.fb.group({
      idProducto: [null as number | null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      precio: [0 as number | null, [Validators.required, Validators.min(0.01)]],
      tipoProducto: [null as number | null, Validators.required],
      descripcion: ['', Validators.required],
      imagenUrl: [''], // <-- CAMBIADO DE idImagen
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
          // Mostrar la imagen existente
          if (data.imagenUrl) {
            this.imagePreview = data.imagenUrl.startsWith('http') 
              ? data.imagenUrl 
              : `${this.apiUrlBase}${data.imagenUrl}`;
          }
        },
        error: (err) => {
          console.error('Error al cargar producto', err);
          this.errorMessage = 'No se pudo cargar el producto. Intente de nuevo.';
        },
      });
  }

  // NUEVO: Manejador para el input de archivo
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Generar vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // MODIFICADO: Lógica de guardado
  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    // Paso 1: Subir la imagen SI se seleccionó una nueva
    if (this.selectedFile) {
      this.service.uploadImagen(this.selectedFile).subscribe({
        next: (response) => {
          // Paso 2: Usar la URL devuelta para guardar el producto
          this.ejecutarGuardado(response.url);
        },
        error: (err) => {
          this.errorMessage = 'Error al subir la imagen.';
          this.isSaving = false;
        },
      });
    } else {
      // Paso 2 (Alternativo): Guardar el producto sin cambiar la imagen
      const existingUrl = this.productoForm.get('imagenUrl')?.value;
      this.ejecutarGuardado(existingUrl || null);
    }
  }

  // NUEVO: Función helper para guardar
  private ejecutarGuardado(imageUrl: string | null): void {
    const rawValue = this.productoForm.getRawValue();

    const productoParaGuardar: Producto = {
      nombre: rawValue.nombre!,
      precio: rawValue.precio!,
      tipoProducto: rawValue.tipoProducto!,
      descripcion: rawValue.descripcion!,
      idProducto: rawValue.idProducto ? rawValue.idProducto : undefined,
      imagenUrl: imageUrl || undefined, // Asignar la URL de la imagen
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
      },
    });
  }

  cargarDropdowns(): void {
    // Cargar Tipos de Producto
    this.valoresComunesService.getByTabla('REP002').subscribe({
      next: (data) => {
        this.tipoProductoOpciones = data.map((v) => ({
          id: Number(v.clave1),
          nombre: v.valor1,
        }));
        if (!this.id && this.tipoProductoOpciones.length > 0) {
          this.productoForm.patchValue({
            tipoProducto: this.tipoProductoOpciones[0].id
          });
        }
      },
      error: (err) => console.error('Error al cargar tipos de producto', err),
    });
    
    // Ya no cargamos imágenes desde REP003
  }

  get f() {
    return this.productoForm.controls;
  }
}

// Interfaz del formulario actualizada
interface ProductoForm {
  idProducto: FormControl<number | null>;
  nombre: FormControl<string | null>;
  precio: FormControl<number | null>;
  tipoProducto: FormControl<number | null>;
  descripcion: FormControl<string | null>;
  imagenUrl: FormControl<string | null>; // <-- CAMBIADO DE idImagen
}