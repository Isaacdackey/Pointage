import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { KpiCardComponent } from '../../shared/components/kpi-card/kpi-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../shared/services/toast.service';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Alert } from '../../core/models/fleet.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PageHeaderComponent, KpiCardComponent, StatusBadgeComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private mockService = inject(MockDataService);
  private toast = inject(ToastService);
  private router = inject(Router);

  vehicles$ = this.mockService.getVehicles();
  missions$ = this.mockService.getMissions();
  alerts$ = this.mockService.getAlerts();

  // Modal de traitement de l'anomalie
  selectedAlertToResolve: Alert | null = null;
  resolutionReason: string = 'CHAUFFEUR_CONTACTE';
  resolutionComment: string = '';

  // Dynamic KPIs calculated from MockDataService
  activeVehiclesCount$ = this.vehicles$.pipe(
    map(vehicles => vehicles.filter(v => v.status !== 'MAINTENANCE' && v.status !== 'INDISPONIBLE').length)
  );

  todayMissionsCount$ = this.missions$.pipe(
    map(missions => missions.length)
  );

  openAlertsCount$ = this.alerts$.pipe(
    map(alerts => alerts.filter(a => a.status === 'NOUVELLE' || a.status === 'PRISE_EN_CHARGE').length)
  );

  openResolveModal(alert: Alert) {
    this.selectedAlertToResolve = alert;
    this.resolutionReason = 'CHAUFFEUR_CONTACTE';
    this.resolutionComment = '';
  }

  closeResolveModal() {
    this.selectedAlertToResolve = null;
    this.resolutionComment = '';
  }

  confirmResolveAlert() {
    if (!this.selectedAlertToResolve) return;
    const alertId = this.selectedAlertToResolve.id;
    const vehicleReg = this.selectedAlertToResolve.vehicleReg;

    this.mockService.updateAlertStatus(alertId, 'CLOTUREE');
    this.toast.success(`L'anomalie sur ${vehicleReg} a été clôturée avec succès.`);
    this.closeResolveModal();
  }

  viewAlertOnMap() {
    if (!this.selectedAlertToResolve) return;
    const vehicleId = this.selectedAlertToResolve.vehicleId;
    this.closeResolveModal();
    this.router.navigate(['/map'], { queryParams: { vehicle: vehicleId } });
  }

  resolveAlert(id: string) {
    this.mockService.updateAlertStatus(id, 'CLOTUREE');
    this.toast.success("L'anomalie a été marquée comme clôturée avec succès.");
  }

  getFreshnessClass(seconds?: number): string {
    if (!seconds) return 'fresh-red';
    if (seconds < 60) return 'fresh-green';
    if (seconds < 300) return 'fresh-orange';
    return 'fresh-red';
  }

  formatFreshness(seconds?: number): string {
    if (!seconds) return 'Inconnu';
    if (seconds < 60) return `${seconds}s (en direct)`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    return `${hours}h (muet)`;
  }
}
