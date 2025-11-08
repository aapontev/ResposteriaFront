import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. IMPORTAR ReactiveFormsModule y FormBuilder
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ValoresComunesService } from '../../shared/service/valores-comunes.service';
import { ValoresComunes } from '../../shared/models/valores-comunes.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-valores-comunes-form',
  standalone: true,
  // 2. AÑADIR ReactiveFormsModule AQUÍ
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './valores-comunes-form.component.html',
})
export class ValoresComunesFormComponent implements OnInit {
  id?: number;
  valorForm: FormGroup<ValorForm>;

  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;

  constructor(
    private service: ValoresComunesService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder // 3. Inyectar FormBuilder
  ) {
    // 4. Ahora 'this.fb' ya no será undefined
    this.valorForm = this.fb.group({
      idValoresComunes: [null as number | null],
      codTabla: ['', Validators.required],
      clave1: ['', Validators.required],
      clave2: [''],
      valor1: [''],
      valor2: [''],
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.cargarValor();
    }
  }

  cargarValor(): void {
    this.isLoading = true;
    this.service
      .getById(this.id!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (data) => {
          this.valorForm.patchValue(data);
        },
        error: (err) => {
          console.error('Error al cargar valor', err);
          this.errorMessage = 'No se pudo cargar el registro.';
        },
      });
  }

  guardar(): void {
    if (this.valorForm.invalid) {
      this.valorForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;

    const rawValue = this.valorForm.getRawValue();

    // Mapeo manual para que coincida con el modelo (con ID opcional)
    const valorParaGuardar: ValoresComunes = {
      codTabla: rawValue.codTabla!,
      clave1: rawValue.clave1!,
      clave2: rawValue.clave2 || '',
      valor1: rawValue.valor1 || '',
      valor2: rawValue.valor2 || '',
      idValoresComunes: rawValue.idValoresComunes
        ? rawValue.idValoresComunes
        : undefined,
    };

    // Si es un registro nuevo, eliminamos el ID
    if (!this.id) {
      delete valorParaGuardar.idValoresComunes;
    }

    const saveOperation = this.id
      ? this.service.update(this.id, valorParaGuardar)
      : this.service.create(valorParaGuardar);

    saveOperation.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: () => {
        this.router.navigate(['/valorescomunes']);
      },
      error: (err) => {
        console.error('Error al guardar', err);
        this.errorMessage = 'Error al guardar el registro.';
      },
    });
  }

  get f() {
    return this.valorForm.controls;
  }
}

// Interfaz de tipado fuerte para el FormGroup
interface ValorForm {
  idValoresComunes: FormControl<number | null>;
  codTabla: FormControl<string | null>;
  clave1: FormControl<string | null>;
  clave2: FormControl<string | null>;
  valor1: FormControl<string | null>;
  valor2: FormControl<string | null>;
}