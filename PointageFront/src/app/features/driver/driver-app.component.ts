import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { Mission, TripEvent } from '../../core/models/fleet.models';
import { Subscription, combineLatest } from 'rxjs';

interface PendingOfflineEvent {
  type: 'DEPART' | 'PAUSE' | 'REPRISE' | 'ARRIVEE' | 'INCIDENT';
  missionId: string;
  comment: string;
  timestamp: string;
}

@Component({
  selector: 'app-driver-app',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent],
  templateUrl: './driver-app.component.html',
  styleUrl: './driver-app.component.scss'
})
export class DriverAppComponent implements OnInit, OnDestroy {
  private mockService = inject(MockDataService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  events$ = this.mockService.getTripEvents();
  activeMission: Mission | null = null;
  currentDriverName = '';
  driverInitials = 'CH';

  isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  offlineQueue: PendingOfflineEvent[] = [];

  // Bottom Sheet for incident
  incidentSheetOpen = false;
  incidentType = 'Panne mécanique / Crevaison';
  incidentComment = '';

  private sub?: Subscription;
  private onlineListener = () => this.handleNetworkChange(true);
  private offlineListener = () => this.handleNetworkChange(false);

  ngOnInit(): void {
    // Bind network listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.onlineListener);
      window.addEventListener('offline', this.offlineListener);
    }

    // Bind logged in driver & dynamic active mission
    this.sub = combineLatest([
      this.authService.currentUser$,
      this.mockService.getMissions()
    ]).subscribe(([user, missions]) => {
      this.currentDriverName = user?.fullName || 'Mamadou Diallo';
      this.driverInitials = user?.avatarText || this.currentDriverName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      // Find active mission for this driver or the first active mission in progress/planned
      const driverMission = missions.find(
        m => m.driverName === this.currentDriverName && m.status !== 'TERMINEE'
      );

      this.activeMission = driverMission || missions.find(m => m.status !== 'TERMINEE') || null;
    });
  }

  private handleNetworkChange(online: boolean) {
    this.isOnline = online;
    if (online) {
      this.toast.success('Connexion réseau rétablie. Vous êtes de nouveau en ligne.');
      if (this.offlineQueue.length > 0) {
        this.syncOfflineQueue();
      }
    } else {
      this.toast.warning('Connexion perdue. Vos pointages seront stockés localement.');
    }
  }

  triggerEvent(type: 'DEPART' | 'PAUSE' | 'REPRISE' | 'ARRIVEE') {
    if (!this.activeMission) return;

    if (!this.isOnline) {
      // Offline queue
      this.offlineQueue.push({
        type,
        missionId: this.activeMission.id,
        comment: `Action chauffeur hors-ligne : ${type}`,
        timestamp: new Date().toISOString()
      });
      this.toast.info(`Pointage ${type} enregistré hors-ligne dans la file d'attente.`);
      return;
    }

    this.mockService.declareDriverEvent(type, this.activeMission.id).subscribe(() => {
      const messages: Record<string, string> = {
        DEPART: 'Départ déclaré ! Transmis au centre de contrôle en attente d\'acceptation.',
        PAUSE: 'Pause déclarée. Le véhicule est en arrêt momentané.',
        REPRISE: 'Reprise de route enregistrée.',
        ARRIVEE: 'Arrivée déclarée ! En attente de validation et clôture par le superviseur.'
      };
      this.toast.success(messages[type] || 'Pointage enregistré.');
    });
  }

  openIncidentBottomSheet() {
    this.incidentSheetOpen = true;
  }

  closeIncidentBottomSheet() {
    this.incidentSheetOpen = false;
    this.incidentComment = '';
  }

  submitIncident() {
    if (!this.activeMission) return;

    const fullComment = `${this.incidentType} : ${this.incidentComment || 'Signalé sans détail'}`;

    if (!this.isOnline) {
      this.offlineQueue.push({
        type: 'INCIDENT',
        missionId: this.activeMission.id,
        comment: fullComment,
        timestamp: new Date().toISOString()
      });
      this.toast.warning("Incident stocké hors-ligne. Il sera transmis dès le retour de l'accès réseau.");
    } else {
      this.mockService.declareDriverEvent('INCIDENT', this.activeMission.id, fullComment).subscribe(() => {
        this.toast.warning("Incident transmis d'urgence au superviseur et consigné au journal.");
      });
    }

    this.closeIncidentBottomSheet();
  }

  syncOfflineQueue() {
    if (!this.isOnline || this.offlineQueue.length === 0) return;

    const count = this.offlineQueue.length;
    this.offlineQueue.forEach(item => {
      this.mockService.declareDriverEvent(item.type, item.missionId, `${item.comment} (Sync différée)`);
    });

    this.offlineQueue = [];
    this.toast.success(`${count} pointage(s) synchronisé(s) avec le serveur avec succès.`);
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.onlineListener);
      window.removeEventListener('offline', this.offlineListener);
    }
    this.sub?.unsubscribe();
  }
}
