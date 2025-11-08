import { Routes } from '@angular/router';
import { IngredientesListComponent } from './ingredientes-list/ingredientes-list.component';
import { IngredientesFormComponent } from './ingredientes-form/ingredientes-form.component';

export const INGREDIENTES_ROUTES: Routes = [
  { path: '', component: IngredientesListComponent },
  { path: 'nuevo', component: IngredientesFormComponent },
  { path: 'editar/:id', component: IngredientesFormComponent },
];
