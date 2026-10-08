import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'expedientes' },
  {
    path: 'expedientes',
    loadChildren: () => import('./features/expedientes/expedientes.routes').then((m) => m.EXPEDIENTES_ROUTES),
  },
  { path: '**', redirectTo: 'expedientes' },
];
