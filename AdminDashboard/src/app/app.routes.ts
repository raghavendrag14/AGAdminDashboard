import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () =>
      import('./features/dashboard/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent,
      ),
    children: [
      {
        path: 'roles',
        data: { breadcrumb: 'Roles' },
        loadComponent: () =>
          import('./features/role/pages/role-list/role-list.page').then((m) => m.RoleListPage),
      },
      {
        path: 'users',
        data: { breadcrumb: 'Users' },
        loadComponent: () =>
          import('./features/user/pages/user-management/user-management.page').then((m) => m.UserManagementPage),
      },
      {
        path: 'profile/:id',
        data: { breadcrumb: 'Profile' },
        loadComponent: () =>
          import('./features/user/pages/user-profile-page/user-profile-page.component').then((m) => m.UserProfilePageComponent),
      },
      {
        path: 'my-profile',
        data: { breadcrumb: 'My Profile' },
        loadComponent: () =>
          import('./features/user/pages/user-profile-page/user-profile-page.component').then((m) => m.UserProfilePageComponent),
      },
      {
        path: '',
            data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('./features/dashboard/content/dashboard-content.component').then(
            (m) => m.DashboardContentComponent,
          ),
      }
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
