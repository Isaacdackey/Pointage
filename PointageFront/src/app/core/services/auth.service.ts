import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'SUPER_ADMIN' | 'USER';

export interface UserSession {
  username: string;
  fullName: string;
  role: UserRole;
  roleLabel: string;
  location: string;
  avatarText: string;
  canDelete: boolean;
}

const STORAGE_KEY = 'geofleet_session';

const DEFAULT_USERS: Record<UserRole, UserSession> = {
  SUPER_ADMIN: {
    username: 'admin@geofleet.sn',
    fullName: 'Amadou Diallo',
    role: 'SUPER_ADMIN',
    roleLabel: 'Super Administrateur',
    location: 'Direction Générale - Dakar',
    avatarText: 'AD',
    canDelete: true
  },
  USER: {
    username: 'logistique@geofleet.sn',
    fullName: 'Samba Kane',
    role: 'USER',
    roleLabel: 'Responsable Flotte & Logistique',
    location: 'Poste Exploitation - Diamniadio',
    avatarText: 'SK',
    canDelete: false
  }
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserSession | null>(this.loadStoredSession());
  currentUser$: Observable<UserSession | null> = this.currentUserSubject.asObservable();

  private loadStoredSession(): UserSession | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UserSession;
      }
    } catch {
      // fallback
    }
    // Par defaut pour le mock, on demarre en SUPER_ADMIN si aucune session
    return DEFAULT_USERS.SUPER_ADMIN;
  }

  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.getValue();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  getUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  login(role: UserRole, customUsername?: string): UserSession {
    const base = DEFAULT_USERS[role];
    const session: UserSession = {
      ...base,
      username: customUsername || base.username
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
    this.currentUserSubject.next(session);
    return session;
  }

  logout() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    this.currentUserSubject.next(null);
  }
}
