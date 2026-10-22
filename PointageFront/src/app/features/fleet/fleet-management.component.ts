import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../shared/services/toast.service';

import { FormsModule } from '@angular/forms';

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

  activeTab: 'VEHICULES' | 'CHAUFFEURS' | 'TRACEURS' = 'VEHICULES';

  vehicles$ = this.mockService.getVehicles();
  drivers$ = this.mockService.getDrivers();
  trackers$ = this.mockService.getTrackers();

  // Modal Enregistrer un Véhicule
  isAddModalOpen = false;
  newVehicle = {
    registrationNumber: '',
    make: 'Toyota',
    model: '',
    type: 'Fourgonnette livraison',
    odometerKm: 45000,
    fuelLevelPercent: 100,
    assignedDriverId: '',
    currentTrackerId: 'tr-001'
  };

  formatNumber(val: number): string {
    return val.toLocaleString('fr-FR');
  }

  openAddModal() {
    this.newVehicle = {
      registrationNumber: '',
      make: 'Toyota',
      model: '',
      type: 'Fourgonnette livraison',
      odometerKm: 45000,
      fuelLevelPercent: 100,
      assignedDriverId: '',
      currentTrackerId: 'tr-001'
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
}
