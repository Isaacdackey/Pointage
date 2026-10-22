import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DriverLayoutComponent } from './layouts/driver-layout/driver-layout.component';

export const routes: Routes = [
  // 1. Redirection de la racine vers dashboard (ou login si non connecté)
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },

  // 2. Layout Authentification (Login seul)
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
        title: 'Connexion • GeoFleet'
      }
    ]
  },

  // 3. Layout Chauffeur (Mobile-first plein écran, barre d'action inférieure)
  {
    path: 'driver',
    component: DriverLayoutComponent,
    canActivate: [authGuard, roleGuard(['DRIVER', 'ADMIN'])],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/driver/driver-app.component').then(m => m.DriverAppComponent),
        title: 'Pointage Chauffeur • GeoFleet'
      }
    ]
  },

  // 4. Layout Admin & Agent (Sidebar Zinc + Topbar)
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [roleGuard(['ADMIN', 'AGENT'])],
        title: 'Tableau de bord • GeoFleet'
      },
      {
        path: 'map',
        loadComponent: () => import('./features/map/live-map.component').then(m => m.LiveMapComponent),
        canActivate: [roleGuard(['ADMIN', 'AGENT'])],
        title: 'Carte en direct • GeoFleet'
      },
      {
        path: 'control',
        loadComponent: () => import('./features/control/control-console.component').then(m => m.ControlConsoleComponent),
        canActivate: [roleGuard(['ADMIN', 'AGENT'])],
        title: 'Console de Contrôle • GeoFleet'
      },
      {
        path: 'missions',
        loadComponent: () => import('./features/missions/missions-list.component').then(m => m.MissionsListComponent),
        canActivate: [roleGuard(['ADMIN', 'AGENT', 'DRIVER'])],
        title: 'Planning des Missions • GeoFleet'
      },
      {
        path: 'fleet',
        loadComponent: () => import('./features/fleet/fleet-management.component').then(m => m.FleetManagementComponent),
        canActivate: [roleGuard(['ADMIN'])],
        title: 'Gestion de Flotte • GeoFleet'
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
        canActivate: [roleGuard(['ADMIN'])],
        title: 'Rapports & Synthèse • GeoFleet'
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin-settings.component').then(m => m.AdminSettingsComponent),
        canActivate: [roleGuard(['ADMIN'])],
        title: 'Seuils & Audit • GeoFleet'
      }
    ]
  },

  // 5. Wildcard fallback
  { path: '**', redirectTo: 'dashboard' }
];
