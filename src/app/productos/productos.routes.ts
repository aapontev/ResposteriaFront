// src/app/productos/productos.routes.ts
import { Routes } from '@angular/router';
import { ProductosListComponent } from './productos-list/productos-list.component';
import { ProductosFormComponent } from './productos-form/productos-form.component';

export const PRODUCTOS_ROUTES: Routes = [
  { path: '', component: ProductosListComponent },
  { path: 'nuevo', component: ProductosFormComponent },
  { path: 'editar/:id', component: ProductosFormComponent },
];