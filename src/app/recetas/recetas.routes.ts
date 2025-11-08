import { Routes } from '@angular/router';
import { RecetasListComponent } from './recetas-list/recetas-list.component';
import { RecetasFormComponent } from './recetas-form/recetas-form.component';

export const RECETAS_ROUTES: Routes = [
    { path: '', component: RecetasListComponent },
  { path: 'nuevo', component: RecetasFormComponent },
  { path: 'editar/:id', component: RecetasFormComponent }
]