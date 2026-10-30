import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';

import { ModalA11yDirective } from '../../shared/directives/modal-a11y.directive';
import { UserRole } from '../../core/services/auth.service';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetEntity: string;
  details: string;
  ipAddress: string;
}

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  lastLogin: string;
  status: 'ACTIF' | 'SUSPENDU';
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, ModalA11yDirective],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent {
  private toast = inject(ToastService);

  activeTab: 'AUDIT' | 'THRESHOLDS' | 'USERS' = 'AUDIT';

  initialThresholds = {
    maxSpeedKph: 90,
    signalLossMinutes: 15,
    departureDelayToleranceMinutes: 20,
    geofenceRadiusMeters: 500
  };

  thresholds = { ...this.initialThresholds };
  isDirty = false;

  auditLogs: AuditEntry[] = [
    {
      id: 'aud-1',
      timestamp: '2026-10-23T11:25:12Z',
      actor: 'Samba Kane',
      role: 'USER',
      action: 'VEHICLE_REASSIGN',
      targetEntity: 'Véhicule DK-4920-BA',
      details: 'Réassignation temporaire du véhicule suite absence chauffeur titulaire.',
      ipAddress: '196.12.100.45'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-23T10:12:44Z',
      actor: 'Amadou Diallo',
      role: 'SUPER_ADMIN',
      action: 'SITE_CREATED',
      targetEntity: 'Site Total Almadies',
      details: 'Création du site favori géofencé (rayon 20m).',
      ipAddress: '196.12.100.10'
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-23T09:40:02Z',
      actor: 'Amadou Diallo',
      role: 'SUPER_ADMIN',
      action: 'CONFIG_RULE_UPDATE',
      targetEntity: 'Règle Vitesse Maximale',
      details: 'Mise à jour du seuil de vitesse voie express à 90 km/h.',
      ipAddress: '196.12.100.10'
    },
    {
      id: 'aud-4',
      timestamp: '2026-10-19T10:15:30Z',
      actor: 'Amadou Diallo',
      role: 'ADMIN',
      action: 'VEHICLE_TRACKER_LINK',
      targetEntity: 'DK-4920-BA -> tr-001',
      details: 'Association temporelle du traceur Teltonika FMB920 au véhicule Hilux.',
      ipAddress: '196.12.100.10'
    }
  ];

  markDirty(): void {
    this.isDirty =
      this.thresholds.maxSpeedKph !== this.initialThresholds.maxSpeedKph ||
      this.thresholds.signalLossMinutes !== this.initialThresholds.signalLossMinutes ||
      this.thresholds.departureDelayToleranceMinutes !== this.initialThresholds.departureDelayToleranceMinutes ||
      this.thresholds.geofenceRadiusMeters !== this.initialThresholds.geofenceRadiusMeters;
  }

  get isValid(): boolean {
    return (
      this.thresholds.maxSpeedKph >= 40 &&
      this.thresholds.maxSpeedKph <= 150 &&
      this.thresholds.signalLossMinutes >= 5 &&
      this.thresholds.signalLossMinutes <= 120 &&
      this.thresholds.departureDelayToleranceMinutes >= 5 &&
      this.thresholds.departureDelayToleranceMinutes <= 60 &&
      this.thresholds.geofenceRadiusMeters >= 100 &&
      this.thresholds.geofenceRadiusMeters <= 5000
    );
  }

  formatTimestamp(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR');
  }

  saveSettings(): void {
    if (!this.isValid) {
      this.toast.error('Veuillez corriger les valeurs hors limites avant de sauvegarder.');
      return;
    }

    this.initialThresholds = { ...this.thresholds };
    this.isDirty = false;
    this.toast.success('Seuils et règles de détection enregistrés avec succès.');
  }

  // Gestion des Utilisateurs (Conformité Retranscription 23 Octobre)
  users: ManagedUser[] = [
    {
      id: 'usr-1',
      fullName: 'Amadou Diallo',
      email: 'admin@geofleet.sn',
      role: 'SUPER_ADMIN',
      phone: '+221 77 100 20 30',
      location: 'Direction Générale - Dakar',
      lastLogin: 'Aujourd\'hui 12:45',
      status: 'ACTIF'
    },
    {
      id: 'usr-2',
      fullName: 'Samba Kane',
      email: 'logistique@geofleet.sn',
      role: 'USER',
      phone: '+221 78 200 40 50',
      location: 'Poste Exploitation - Diamniadio',
      lastLogin: 'Aujourd\'hui 13:10',
      status: 'ACTIF'
    }
  ];

  isUserModalOpen = false;
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  newUser = {
    fullName: '',
    email: '',
    role: 'USER' as UserRole,
    phone: '',
    location: '',
    password: ''
  };

  openUserModal(): void {
    this.showPassword = false;
    this.newUser = {
      fullName: '',
      email: '',
      role: 'USER',
      phone: '',
      location: 'Dakar Siège',
      password: ''
    };
    this.isUserModalOpen = true;
  }

  closeUserModal(): void {
    this.isUserModalOpen = false;
  }

  saveUser(): void {
    if (!this.newUser.fullName.trim() || !this.newUser.email.trim()) {
      this.toast.error('Veuillez renseigner le nom complet et l\'adresse e-mail.');
      return;
    }

    const created: ManagedUser = {
      id: 'usr-' + (this.users.length + 1),
      fullName: this.newUser.fullName.trim(),
      email: this.newUser.email.trim().toLowerCase(),
      role: this.newUser.role,
      phone: this.newUser.phone.trim() || undefined,
      location: this.newUser.location.trim() || 'Exploitation',
      lastLogin: 'Jamais connecté',
      status: 'ACTIF'
    };

    this.users = [created, ...this.users];

    // Ajouter une entrée d'audit immédiate
    this.auditLogs = [
      {
        id: 'aud-' + Date.now(),
        timestamp: new Date().toISOString(),
        actor: 'Amadou Diallo',
        role: 'SUPER_ADMIN',
        action: 'USER_CREATED',
        targetEntity: `Utilisateur ${created.fullName} (${created.role})`,
        details: `Création du compte utilisateur avec habilitation ${created.role === 'SUPER_ADMIN' ? 'Super Administrateur (tous droits)' : 'Responsable Logistique (sans suppression)'}.`,
        ipAddress: '196.12.100.10'
      },
      ...this.auditLogs
    ];

    this.toast.success(`Compte ${created.fullName} créé avec succès en rôle ${created.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Responsable Logistique'}.`);
    this.closeUserModal();
  }
}
