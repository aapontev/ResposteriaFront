import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'productos', pathMatch: 'full' },

  { path: 'productos', 
    loadChildren: () => import('./productos/productos.routes').then(m => m.PRODUCTOS_ROUTES)
   },
  { 
    path: 'ingredientes', 
    loadChildren: () => import('./ingredientes/ingredientes.routes').then(m => m.INGREDIENTES_ROUTES) 
  },
  { 
    path: 'recetas', 
    loadChildren: () => import('./recetas/recetas.routes').then(m => m.RECETAS_ROUTES) 
  },
  { 
    path: 'valorescomunes', 
    loadChildren: () => import('./valores-comunes/valores-comunes.routes').then(m => m.VALORES_COMUNES_ROUTES) 
  },

  // { path: '**', redirectTo: 'productos' } // Opcional: para rutas no encontradas
];
