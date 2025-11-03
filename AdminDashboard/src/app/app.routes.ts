import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'roles' },
  { path: 'roles', loadChildren: () => import('./features/role/role.module').then(m => m.RoleModule) },
  { path: '**', redirectTo: 'roles' }
];
