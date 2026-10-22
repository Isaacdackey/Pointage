import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';

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

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
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
      timestamp: '2026-10-19T13:25:12Z',
      actor: 'Samba Kane',
      role: 'AGENT',
      action: 'MISSION_VALIDATE',
      targetEntity: 'Mission MIS-2026-089',
      details: 'Validation de la conformité du départ déclaré (11:00 vs 11:02 GPS).',
      ipAddress: '196.12.100.45'
    },
    {
      id: 'aud-2',
      timestamp: '2026-10-19T13:12:44Z',
      actor: 'Mamadou Diallo',
      role: 'DRIVER',
      action: 'DRIVER_POINTAGE_DEPART',
      targetEntity: 'Véhicule DK-4920-BA',
      details: 'Pointage mobile Départ déclaré avec succès.',
      ipAddress: '41.82.201.12'
    },
    {
      id: 'aud-3',
      timestamp: '2026-10-19T11:40:02Z',
      actor: 'Amadou Diallo',
      role: 'ADMIN',
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
      targetEntity: 'DK-4920-BA ➔ tr-001',
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
}
