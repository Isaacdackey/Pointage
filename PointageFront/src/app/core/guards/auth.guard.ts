import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

/**
 * Verifie que l'utilisateur a une session active. Redirige vers /login sinon.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

/**
 * Verifie que le role courant est autorise.
 * ADMIN accède a tout.
 * AGENT accède a control, map, dashboard, missions.
 * DRIVER accède a driver, missions.
 */
export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentRole = authService.getUserRole();
    if (!currentRole) {
      return router.createUrlTree(['/login']);
    }

    if (allowedRoles.includes(currentRole)) {
      return true;
    }

    // Redirection inteligente selon le role actuel
    if (currentRole === 'DRIVER') {
      return router.createUrlTree(['/driver']);
    }
    if (currentRole === 'AGENT') {
      return router.createUrlTree(['/control']);
    }
    return router.createUrlTree(['/dashboard']);
  };
};
