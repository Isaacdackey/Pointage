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
 * SUPER_ADMIN : accès complet y compris suppression et administration.
 * USER : accès opérationnel (dashboard, map, control, missions, fleet, reports) sans suppression.
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

    return router.createUrlTree(['/dashboard']);
  };
};
