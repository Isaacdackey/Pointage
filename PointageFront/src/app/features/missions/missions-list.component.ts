import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../shared/services/toast.service';
import { Mission, GeoSite } from '../../core/models/fleet.models';

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
  geoSites$ = this.mockService.getGeoSites();

  // Filtre d'affichage
  statusFilter: string = 'TOUTES';

  // Modal Planifier une Tournée / Mission
  isModalOpen = false;
  newMission = {
    title: '',
    vehicleId: '',
    driverId: '',
    originSiteId: '',
    originName: '',
    destinationSiteId: '',
    destinationName: '',
    distanceKm: 35,
    plannedStartTime: '',
    notes: ''
  };

  formatDateTime(iso: string | undefined): string {
    if (!iso) return '-';
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  onOriginSiteChange(siteId: string, sites: GeoSite[]) {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      this.newMission.originName = site.name;
    }
  }

  onDestinationSiteChange(siteId: string, sites: GeoSite[]) {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      this.newMission.destinationName = site.name;
    }
  }

  openNewMissionModal() {
    const inOneHour = new Date(Date.now() + 3600 * 1000);
    const dateFormatted = inOneHour.toISOString().slice(0, 16);

    this.newMission = {
      title: '',
      vehicleId: '',
      driverId: '',
      originSiteId: '',
      originName: 'Siège GeoFleet & Dépôt Central',
      destinationSiteId: '',
      destinationName: 'Plateforme Industrielle Diamniadio',
      distanceKm: 35,
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

    if (!this.newMission.originName || !this.newMission.destinationName) {
      this.toast.error('Veuillez renseigner le point d\'origine et la destination de la tournée.');
      return;
    }

    const created = this.mockService.addMission({
      title: this.newMission.title,
      vehicleId: this.newMission.vehicleId,
      driverId: this.newMission.driverId,
      originName: this.newMission.originName,
      destinationName: this.newMission.destinationName,
      originSiteId: this.newMission.originSiteId || undefined,
      destinationSiteId: this.newMission.destinationSiteId || undefined,
      distanceKm: this.newMission.distanceKm,
      plannedStartTime: this.newMission.plannedStartTime ? new Date(this.newMission.plannedStartTime).toISOString() : undefined,
      notes: this.newMission.notes
    });

    this.toast.success(`Tournée ${created.code} créée et surveillée par télématique.`);
    this.isModalOpen = false;
  }
}
