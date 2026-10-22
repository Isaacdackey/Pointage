import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../shared/services/toast.service';
import { Mission, Alert } from '../../core/models/fleet.models';

@Component({
  selector: 'app-control-console',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent, ConfirmDialogComponent],
  templateUrl: './control-console.component.html',
  styleUrl: './control-console.component.scss'
})
export class ControlConsoleComponent {
  private mockService = inject(MockDataService);
  private toast = inject(ToastService);

  missions$ = this.mockService.getMissions();
  alerts$ = this.mockService.getAlerts();

  onlyAnomalies = false;

  // Confirmation modal state
  confirmModalOpen = false;
  confirmMessage = '';
  pendingMissionToValidate: Mission | null = null;

  // Dynamic calculated counts
  activeMissionsCount$ = this.missions$.pipe(
    map(missions => missions.filter(m => m.status === 'EN_COURS').length)
  );

  openAnomaliesCount$ = this.alerts$.pipe(
    map(alerts => alerts.filter(a => a.status !== 'CLOTUREE').length)
  );

  // Filtered and sorted alerts: Critique first, then Majeure, then Mineure
  filteredAlerts$ = this.alerts$.pipe(
    map(alerts => {
      const severityWeight: Record<string, number> = {
        CRITIQUE: 3,
        MAJEURE: 2,
        MINEURE: 1
      };

      let list = [...alerts];
      if (this.onlyAnomalies) {
        list = list.filter(a => a.severity === 'CRITIQUE' || a.severity === 'MAJEURE');
      }

      return list.sort((a, b) => {
        const diff = (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0);
        if (diff !== 0) return diff;
        return a.status === 'NOUVELLE' ? -1 : 1;
      });
    })
  );

  formatTime(iso?: string): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  askValidation(mission: Mission) {
    if (!mission.departureDeclared) {
      this.toast.error("Impossible de valider : le départ n'a pas encore été déclaré.");
      return;
    }
    this.pendingMissionToValidate = mission;
    this.confirmMessage = `Confirmez-vous la conformité et la validation du pointage pour la mission ${mission.code} (${mission.vehicleReg} - ${mission.driverName}) ?`;
    this.confirmModalOpen = true;
  }

  confirmValidation() {
    if (this.pendingMissionToValidate) {
      const code = this.pendingMissionToValidate.code;
      this.confirmModalOpen = false;
      this.pendingMissionToValidate = null;
      this.toast.success(`Le pointage de la mission ${code} a été certifié et validé avec succès.`);
    }
  }

  cancelValidation() {
    this.confirmModalOpen = false;
    this.pendingMissionToValidate = null;
  }

  updateStatus(alertId: string, status: 'PRISE_EN_CHARGE' | 'CLOTUREE') {
    this.mockService.updateAlertStatus(alertId, status);
    const msg = status === 'CLOTUREE' ? "L'alerte a été clôturée." : "L'alerte a été prise en charge.";
    this.toast.info(msg);
  }
}
