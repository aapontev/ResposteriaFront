import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ValoresComunesService } from '../../shared/service/valores-comunes.service';
import { ValoresComunes } from '../../shared/models/valores-comunes.model';

@Component({
  selector: 'app-valores-comunes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './valores-comunes-list.component.html'
})
export class ValoresComunesListComponent implements OnInit {
  titulo: string = '';
  valores: ValoresComunes[] = [];
  mostrarBoton = true ;

  constructor(private service: ValoresComunesService,
              private route: ActivatedRoute,
              private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const parametro = params.get('clave1');
      if(parametro){
        this.titulo = `Parámetros de ${parametro}`;
        this.cargarTabla(parametro);
        this.mostrarBoton = false ;
      }else{
        this.titulo = 'Parámetros Padres'
        this.cargarTabla('0');
      }
    })
  }

  cargarTabla(tabla: string): void {    
      this.service.getByTabla(tabla).subscribe({
        next: (data) => (this.valores = data),
      error: (err) => console.error('Error al cargar valores comunes', err)
      });    
  }

  eliminar(id: number): void {
    if (confirm('¿Seguro de eliminar este registro?')) {
      this.service.delete(id).subscribe(() => this.cargarTabla('0'));
    }
  }

  irConParametros(nombre: string): void {
    this.router.navigate(['/valorescomunes/clave1',nombre]);
  }
}
