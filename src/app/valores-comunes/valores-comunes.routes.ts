import { Routes } from '@angular/router';
import { ValoresComunesListComponent } from './valores-comunes-list/valores-comunes-list.component';
import { ValoresComunesFormComponent } from './valores-comunes-form/valores-comunes-form.component';

export const VALORES_COMUNES_ROUTES: Routes = [
  { path: '', component: ValoresComunesListComponent },
  {
    path: 'clave1/:clave1',
    component: ValoresComunesListComponent,
  },
  { path: 'nuevo', component: ValoresComunesFormComponent },
  { path: 'editar/:id', component: ValoresComunesFormComponent },
];
