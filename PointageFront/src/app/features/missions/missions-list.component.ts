import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../shared/services/toast.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-missions-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.scss'
})
export class MissionsListComponent {
  private mockService = inject(MockDataService);
  private toast = inject(ToastService);

  missions$ = this.mockService.getMissions();
  vehicles$ = this.mockService.getVehicles();
  drivers$ = this.mockService.getDrivers();

  // Modal Planifier une Mission
  isModalOpen = false;
  newMission = {
    title: '',
    vehicleId: '',
    driverId: '',
    originName: 'Port Autonome de Dakar',
    destinationName: 'Plateforme Industrielle Diamniadio',
    distanceKm: 42,
    plannedStartTime: '',
    notes: ''
  };

  formatDateTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  openNewMissionModal() {
    // Initialise l'heure de départ par défaut à dans 1 heure
    const inOneHour = new Date(Date.now() + 3600 * 1000);
    const dateFormatted = inOneHour.toISOString().slice(0, 16);

    this.newMission = {
      title: '',
      vehicleId: '',
      driverId: '',
      originName: 'Port Autonome de Dakar',
      destinationName: 'Plateforme Industrielle Diamniadio',
      distanceKm: 42,
      plannedStartTime: dateFormatted,
      notes: ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveMission() {
    if (!this.newMission.title || !this.newMission.vehicleId || !this.newMission.driverId) {
      this.toast.error('Veuillez renseigner le titre de la mission, sélectionner un véhicule et un chauffeur.');
      return;
    }

    const created = this.mockService.addMission({
      title: this.newMission.title,
      vehicleId: this.newMission.vehicleId,
      driverId: this.newMission.driverId,
      originName: this.newMission.originName,
      destinationName: this.newMission.destinationName,
      distanceKm: this.newMission.distanceKm,
      plannedStartTime: this.newMission.plannedStartTime ? new Date(this.newMission.plannedStartTime).toISOString() : undefined,
      notes: this.newMission.notes
    });

    this.toast.success(`Mission ${created.code} planifiée avec succès !`);
    this.isModalOpen = false;
  }
}
