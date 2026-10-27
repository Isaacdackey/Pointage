import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs/operators';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../shared/services/toast.service';
import { MaintenanceStatus, MaintenanceType, VehicleType } from '../../core/models/fleet.models';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, StatusBadgeComponent],
  templateUrl: './fleet-management.component.html',
  styleUrl: './fleet-management.component.scss'
})
export class FleetManagementComponent {
  private mockService = inject(MockDataService);
  private toast = inject(ToastService);

  activeTab: 'VEHICULES' | 'MAINTENANCE' | 'CHAUFFEURS' | 'TRACEURS' = 'VEHICULES';

  vehicles$ = this.mockService.getVehicles();
  drivers$ = this.mockService.getDrivers();
  trackers$ = this.mockService.getTrackers();
  maintenanceRecords$ = this.mockService.getMaintenanceRecords();

  // Alertes 30 jours et expirations
  get vehiclesExpiringSoon$() {
    return this.vehicles$.pipe(
      map(list => list.filter(v => this.isExpiringSoon(v.technicalInspectionExpiry) || this.isExpiringSoon(v.insuranceExpiry)))
    );
  }

  get vehiclesExpired$() {
    return this.vehicles$.pipe(
      map(list => list.filter(v => this.isExpired(v.technicalInspectionExpiry) || this.isExpired(v.insuranceExpiry)))
    );
  }

  isExpiringSoon(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const expiry = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diffDays = (expiry - now) / (1000 * 3600 * 24);
    return diffDays > 0 && diffDays <= 30;
  }

  isExpired(dateStr: string | undefined): boolean {
    if (!dateStr) return false;
    const expiry = new Date(dateStr).getTime();
    const now = new Date().getTime();
    return expiry < now;
  }

  // Pagination Véhicules
  currentPageVehicles = 1;
  pageSizeVehicles = 6;

  totalVehiclesCount = 0;
  totalPagesVehicles = 1;

  get paginatedVehicles$() {
    return this.vehicles$.pipe(
      map(vehicles => {
        this.totalVehiclesCount = vehicles.length;
        this.totalPagesVehicles = Math.ceil(vehicles.length / this.pageSizeVehicles);
        const start = (this.currentPageVehicles - 1) * this.pageSizeVehicles;
        return vehicles.slice(start, start + this.pageSizeVehicles);
      })
    );
  }

  nextPageVehicles() {
    if (this.currentPageVehicles < this.totalPagesVehicles) {
      this.currentPageVehicles++;
    }
  }

  prevPageVehicles() {
    if (this.currentPageVehicles > 1) {
      this.currentPageVehicles--;
    }
  }

  // Modal Enregistrer un Véhicule
  isAddModalOpen = false;
  newVehicle = {
    registrationNumber: '',
    make: 'Toyota',
    model: '',
    type: 'FOURGONNETTE' as VehicleType,
    odometerKm: 45000,
    assignedDriverId: '',
    currentTrackerId: 'tr-001',
    technicalInspectionExpiry: '2027-12-31',
    insuranceExpiry: '2027-12-31',
    registrationCardNumber: 'CG-SN-2026-0001',
    canCutEngineRemotely: true
  };

  // Modal Carnet d'Entretien
  isAddMaintenanceOpen = false;
  newMaintenance = {
    vehicleId: 'v1',
    vehicleReg: 'DK-4920-BA',
    type: 'VIDANGE' as MaintenanceType,
    title: 'Vidange moteur 10 000 km',
    description: 'Changement huile synthétique 5W30 + filtre à huile et à air.',
    serviceDate: new Date().toISOString().substring(0, 10),
    odometerKm: 65000,
    provider: 'Garage Central Dakar',
    costCfa: 45000,
    status: 'TERMINEE' as MaintenanceStatus
  };

  formatNumber(val: number | undefined): string {
    return (val || 0).toLocaleString('fr-FR');
  }

  openAddModal() {
    this.newVehicle = {
      registrationNumber: '',
      make: 'Toyota',
      model: '',
      type: 'FOURGONNETTE',
      odometerKm: 45000,
      assignedDriverId: '',
      currentTrackerId: 'tr-001',
      technicalInspectionExpiry: '2027-12-31',
      insuranceExpiry: '2027-12-31',
      registrationCardNumber: 'CG-SN-2026-0001',
      canCutEngineRemotely: true
    };
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  saveVehicle() {
    if (!this.newVehicle.registrationNumber || !this.newVehicle.make || !this.newVehicle.model) {
      this.toast.error('Veuillez renseigner l\'immatriculation, la marque et le modèle.');
      return;
    }

    const created = this.mockService.addVehicle(this.newVehicle);
    this.toast.success(`Véhicule ${created.registrationNumber} enregistré avec succès dans le parc.`);
    this.isAddModalOpen = false;
  }

  openAddMaintenance() {
    this.newMaintenance = {
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      type: 'VIDANGE',
      title: 'Vidange moteur 10 000 km',
      description: 'Changement huile synthétique 5W30 + filtre à huile et à air.',
      serviceDate: new Date().toISOString().substring(0, 10),
      odometerKm: 65000,
      provider: 'Garage Central Dakar',
      costCfa: 45000,
      status: 'TERMINEE'
    };
    this.isAddMaintenanceOpen = true;
  }

  reportBreakdown(vehicle: any) {
    this.newMaintenance = {
      vehicleId: vehicle.id,
      vehicleReg: vehicle.registrationNumber,
      type: 'REPARATION',
      title: `Signalement Panne Mécanique - ${vehicle.registrationNumber}`,
      description: `Panne signalée le ${new Date().toLocaleDateString('fr-FR')}. Immobilisation et diagnostic garage requis.`,
      serviceDate: new Date().toISOString().substring(0, 10),
      odometerKm: vehicle.odometerKm || 50000,
      provider: 'Garage Central Dakar',
      costCfa: 0,
      status: 'PLANIFIEE'
    };
    this.activeTab = 'MAINTENANCE';
    this.isAddMaintenanceOpen = true;
  }

  closeAddMaintenance() {
    this.isAddMaintenanceOpen = false;
  }

  saveMaintenance() {
    if (!this.newMaintenance.vehicleId || !this.newMaintenance.costCfa || !this.newMaintenance.title) {
      this.toast.error('Veuillez renseigner le véhicule, l\'intitulé et le montant des travaux.');
      return;
    }

    // Associer l'immatriculation exacte du véhicule sélectionné
    const currentVehicles = this.mockService.getVehiclesDirect();
    const v = currentVehicles.find(x => x.id === this.newMaintenance.vehicleId);
    if (v) {
      this.newMaintenance.vehicleReg = v.registrationNumber;
    }

    this.mockService.addMaintenanceRecord(this.newMaintenance);
    this.toast.success('Intervention d\'entretien ajoutée avec succès au carnet numérique.');
    this.isAddMaintenanceOpen = false;
  }
}
