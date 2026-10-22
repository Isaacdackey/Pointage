import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';

interface ReportRow {
  vehicleReg: string;
  driverName: string;
  category: 'ACTIVE' | 'AVAILABLE' | 'OTHER';
  totalMissions: number;
  totalKm: number;
  avgSpeedKph: number;
  ontimePercent: number;
  alertsCount: number;
  fuelEstimatedLiters: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  private toast = inject(ToastService);

  selectedPeriod = 'THIS_MONTH';
  vehicleFilter = 'ALL';
  statusFilter = 'ALL';

  rawData: ReportRow[] = [
    { vehicleReg: 'DK-4920-BA', driverName: 'Mamadou Diallo', category: 'ACTIVE', totalMissions: 18, totalKm: 460, avgSpeedKph: 51, ontimePercent: 96, alertsCount: 1, fuelEstimatedLiters: 55 },
    { vehicleReg: 'DK-8112-BB', driverName: 'Abdoulaye Ndiaye', category: 'ACTIVE', totalMissions: 22, totalKm: 310, avgSpeedKph: 42, ontimePercent: 88, alertsCount: 2, fuelEstimatedLiters: 38 },
    { vehicleReg: 'TH-3310-A', driverName: 'Ousmane Sow', category: 'AVAILABLE', totalMissions: 14, totalKm: 520, avgSpeedKph: 64, ontimePercent: 100, alertsCount: 0, fuelEstimatedLiters: 62 },
    { vehicleReg: 'DK-1092-BC', driverName: 'Ibrahima Ba', category: 'OTHER', totalMissions: 6, totalKm: 85, avgSpeedKph: 38, ontimePercent: 92, alertsCount: 1, fuelEstimatedLiters: 11 },
    { vehicleReg: 'SL-6654-B', driverName: 'Cheikh Fall', category: 'OTHER', totalMissions: 4, totalKm: 53, avgSpeedKph: 45, ontimePercent: 95, alertsCount: 0, fuelEstimatedLiters: 5 }
  ];

  countByCategory(category: 'ACTIVE' | 'AVAILABLE'): number {
    return this.rawData.filter(r => r.category === category).length;
  }

  get filteredReports(): ReportRow[] {
    return this.rawData.filter(row => {
      // Vehicle filter
      if (this.vehicleFilter === 'ACTIVE' && row.category !== 'ACTIVE') return false;
      if (this.vehicleFilter === 'AVAILABLE' && row.category !== 'AVAILABLE') return false;

      // Status filter
      if (this.statusFilter === 'ONTIME' && row.ontimePercent < 90) return false;
      if (this.statusFilter === 'DELAY' && row.ontimePercent >= 90) return false;

      return true;
    });
  }

  get totalKmCalculated(): number {
    return this.filteredReports.reduce((sum, r) => sum + r.totalKm, 0);
  }

  get totalMissionsCalculated(): number {
    return this.filteredReports.reduce((sum, r) => sum + r.totalMissions, 0);
  }

  get totalFuelCalculated(): number {
    return this.filteredReports.reduce((sum, r) => sum + r.fuelEstimatedLiters, 0);
  }

  get avgOntimeCalculated(): number {
    if (this.filteredReports.length === 0) return 0;
    const sum = this.filteredReports.reduce((acc, r) => acc + r.ontimePercent, 0);
    return Math.round((sum / this.filteredReports.length) * 10) / 10;
  }

  exportData(format: 'CSV' | 'EXCEL' | 'PDF') {
    this.toast.info(`Génération de l'export ${format} pour la période "${this.selectedPeriod}" en cours...`);
  }
}
