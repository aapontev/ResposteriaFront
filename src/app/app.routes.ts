import { Routes } from '@angular/router';
import { ProductosListComponent } from './productos/productos-list/productos-list.component';
import { ProductosFormComponent } from './productos/productos-form/productos-form.component';
import { IngredientesListComponent } from './ingredientes/ingredientes-list/ingredientes-list.component';
import { IngredientesFormComponent } from './ingredientes/ingredientes-form/ingredientes-form.component';
import { ValoresComunesListComponent } from './valores-comunes/valores-comunes-list/valores-comunes-list.component';
import { ValoresComunesFormComponent } from './valores-comunes/valores-comunes-form/valores-comunes-form.component';
import { RecetasListComponent } from './recetas/recetas-list/recetas-list.component';
import { RecetasFormComponent } from './recetas/recetas-form/recetas-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  { path: 'productos', component: ProductosListComponent },
  { path: 'productos/nuevo', component: ProductosFormComponent },
  { path: 'productos/editar/:id', component: ProductosFormComponent },

  { path: 'ingredientes', component: IngredientesListComponent },
  { path: 'ingredientes/nuevo', component: IngredientesFormComponent },
  { path: 'ingredientes/editar/:id', component: IngredientesFormComponent },

  { path: 'valorescomunes', component: ValoresComunesListComponent },
  { path: 'valorescomunes/clave1/:clave1', component: ValoresComunesListComponent },
  { path: 'valorescomunes/nuevo', component: ValoresComunesFormComponent },
  { path: 'valorescomunes/editar/:id', component: ValoresComunesFormComponent },

  { path: 'recetas', component: RecetasListComponent },
  { path: 'recetas/nuevo', component: RecetasFormComponent },
  { path: 'recetas/editar/:id', component: RecetasFormComponent },
];
