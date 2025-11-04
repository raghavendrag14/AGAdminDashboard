import { Routes } from '@angular/router';
import type { RoleListPage } from './features/role/pages/role-list/role-list.page';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'roles' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login.page').then(m => m.LoginPage)
  },
  {
    path: 'roles',
    loadComponent: () => import('./features/role/pages/role-list/role-list.page').then(m => m.RoleListPage)
  },
  { path: '**', redirectTo: 'roles' }
];
