import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ValoresComunesService } from '../../shared/service/valores-comunes.service';
import { ValoresComunes } from '../../shared/models/valores-comunes.model';

@Component({
  selector: 'app-valores-comunes-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './valores-comunes-form.component.html'
})
export class ValoresComunesFormComponent implements OnInit {
  id?: number;
  valor: ValoresComunes = {
    idValoresComunes: 0,
    codTabla: '',
    clave1: '',
    clave2: '',
    valor1: '',
    valor2: ''
  };

  constructor(
    private service: ValoresComunesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.service.getById(this.id).subscribe({
        next: (data) => (this.valor = data)
      });
    }
  }

  guardar(): void {
    if (this.id) {
      this.service.update(this.id, this.valor).subscribe(() => {
        this.router.navigate(['/valorescomunes']);
      });
    } else {
      this.service.create(this.valor).subscribe(() => {
        this.router.navigate(['/valorescomunes']);
      });
    }
  }
}