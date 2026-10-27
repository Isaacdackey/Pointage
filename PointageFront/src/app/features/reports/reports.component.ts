import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { MaintenanceStatus, MaintenanceType } from '../../core/models/fleet.models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  private toast = inject(ToastService);
  private mockService = inject(MockDataService);

  vehicles$ = this.mockService.getVehicles();
  maintenanceRecords$ = this.mockService.getMaintenanceRecords();

  filterType = 'ALL';
  filterStatus = 'ALL';
  searchQuery = '';

  // Modal Planifier / Signaler Maintenance
  isAddMaintenanceOpen = false;
  newMaintenance = {
    vehicleId: 'v1',
    vehicleReg: 'DK-4920-BA',
    type: 'REPARATION' as MaintenanceType,
    title: 'Signalement panne mécanique',
    description: '',
    serviceDate: new Date().toISOString().substring(0, 10),
    odometerKm: 65000,
    provider: 'Garage Central Dakar',
    costCfa: 0,
    status: 'PLANIFIEE' as MaintenanceStatus
  };

  formatNumber(val: number | undefined): string {
    return (val || 0).toLocaleString('fr-FR');
  }

  // KPIs de maintenance
  get totalInterventions(): number {
    return this.mockService.getMaintenanceRecordsDirect().length;
  }

  get totalCostCfa(): number {
    return this.mockService.getMaintenanceRecordsDirect().reduce((sum, m) => sum + (m.costCfa || 0), 0);
  }

  get pendingRepairsCount(): number {
    return this.mockService.getMaintenanceRecordsDirect().filter(m => m.status === 'PLANIFIEE').length;
  }

  get vehiclesUnderMaintenanceCount(): number {
    return this.mockService.getVehiclesDirect().filter(v => v.status === 'MAINTENANCE').length;
  }

  filteredRecords(records: any[] | null) {
    if (!records) return [];
    return records.filter(m => {
      if (this.filterType !== 'ALL' && m.type !== this.filterType) return false;
      if (this.filterStatus !== 'ALL' && m.status !== this.filterStatus) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchVeh = (m.vehicleReg || '').toLowerCase().includes(q);
        const matchTitle = (m.title || '').toLowerCase().includes(q);
        const matchProvider = (m.provider || '').toLowerCase().includes(q);
        return matchVeh || matchTitle || matchProvider;
      }
      return true;
    });
  }

  openAddMaintenance() {
    this.newMaintenance = {
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      type: 'REPARATION',
      title: 'Signalement panne mécanique',
      description: '',
      serviceDate: new Date().toISOString().substring(0, 10),
      odometerKm: 65000,
      provider: 'Garage Central Dakar',
      costCfa: 0,
      status: 'PLANIFIEE'
    };
    this.isAddMaintenanceOpen = true;
  }

  closeAddMaintenance() {
    this.isAddMaintenanceOpen = false;
  }

  saveMaintenance() {
    if (!this.newMaintenance.vehicleId || !this.newMaintenance.title) {
      this.toast.error('Veuillez renseigner le véhicule et l\'intitulé des travaux.');
      return;
    }
    const currentVehicles = this.mockService.getVehiclesDirect();
    const v = currentVehicles.find(x => x.id === this.newMaintenance.vehicleId);
    if (v) {
      this.newMaintenance.vehicleReg = v.registrationNumber;
    }
    this.mockService.addMaintenanceRecord(this.newMaintenance);
    this.toast.success('Intervention enregistrée avec succès au carnet d\'entretien.');
    this.isAddMaintenanceOpen = false;
  }

}
