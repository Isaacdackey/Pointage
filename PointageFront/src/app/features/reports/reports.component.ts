import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { MockDataService } from '../../core/services/mock-data.service';
import { MaintenanceStatus, MaintenanceType, ScheduledDeadline, ScheduledDeadlineType } from '../../core/models/fleet.models';

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
  deadlines$ = this.mockService.getDeadlines();

  // Onglet principal dans la page : HISTORIQUE vs ECHEANCES
  activeMaintenanceTab: 'HISTORIQUE' | 'ECHEANCES' = 'HISTORIQUE';

  filterType = 'ALL';
  filterStatus = 'ALL';
  searchQuery = '';

  // Filtres Échéances
  deadlineFilterType: 'ALL' | ScheduledDeadlineType = 'ALL';

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

  // Modal Programmer Échéance (Assurance, Visite Technique, Vidange)
  isAddDeadlineOpen = false;
  newDeadline = {
    vehicleId: 'v1',
    vehicleReg: 'DK-4920-BA',
    type: 'ASSURANCE' as ScheduledDeadlineType,
    title: 'Renouvellement Police d\'Assurance',
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
    reminderLeadDays: 7,
    odometerDueKm: undefined as number | undefined,
    provider: 'AXA Assurances',
    notes: ''
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

  // KPIs Échéances
  get urgentDeadlinesCount(): number {
    return this.mockService.getDeadlinesDirect().filter(d => d.status === 'EN_ALERTE' || d.status === 'EXPIREE').length;
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

  filteredDeadlines(deadlines: ScheduledDeadline[] | null) {
    if (!deadlines) return [];
    return deadlines.filter(d => {
      if (this.deadlineFilterType !== 'ALL' && d.type !== this.deadlineFilterType) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchVeh = (d.vehicleReg || '').toLowerCase().includes(q);
        const matchTitle = (d.title || '').toLowerCase().includes(q);
        const matchProv = (d.provider || '').toLowerCase().includes(q);
        return matchVeh || matchTitle || matchProv;
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

  // Gestion des Échéances
  openAddDeadline() {
    this.newDeadline = {
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      type: 'ASSURANCE',
      title: 'Renouvellement Police d\'Assurance',
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().substring(0, 10),
      reminderLeadDays: 7,
      odometerDueKm: undefined,
      provider: 'AXA Assurances Dakar',
      notes: ''
    };
    this.isAddDeadlineOpen = true;
  }

  closeAddDeadline() {
    this.isAddDeadlineOpen = false;
  }

  onDeadlineTypeChange(type: ScheduledDeadlineType) {
    if (type === 'ASSURANCE') {
      this.newDeadline.title = 'Renouvellement Police d\'Assurance';
      this.newDeadline.provider = 'AXA Assurances Dakar';
      this.newDeadline.reminderLeadDays = 7;
    } else if (type === 'VISITE_TECHNIQUE') {
      this.newDeadline.title = 'Visite Technique Réglementaire';
      this.newDeadline.provider = 'Centre Contrôle Technique Automobile';
      this.newDeadline.reminderLeadDays = 10;
    } else if (type === 'VIDANGE') {
      this.newDeadline.title = 'Vidange Moteur & Remplacement Filtres';
      this.newDeadline.provider = 'Total Lubrifiants Hann';
      this.newDeadline.reminderLeadDays = 5;
    }
  }

  saveDeadline() {
    if (!this.newDeadline.vehicleId || !this.newDeadline.dueDate || !this.newDeadline.title) {
      this.toast.error('Veuillez renseigner le véhicule, l\'intitulé et la date d\'échéance.');
      return;
    }
    const currentVehicles = this.mockService.getVehiclesDirect();
    const v = currentVehicles.find(x => x.id === this.newDeadline.vehicleId);
    if (v) {
      this.newDeadline.vehicleReg = v.registrationNumber;
    }
    this.mockService.addDeadline(this.newDeadline);
    this.toast.success(`Échéance ${this.newDeadline.type} programmée avec succès.`);
    this.isAddDeadlineOpen = false;
  }

  getDaysRemaining(dueDate: string): number {
    const today = new Date().setHours(0, 0, 0, 0);
    const target = new Date(dueDate).setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 3600 * 24));
  }
}
