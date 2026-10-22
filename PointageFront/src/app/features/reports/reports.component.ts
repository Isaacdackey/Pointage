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
    if (format === 'CSV') {
      this.downloadCSV();
    } else if (format === 'EXCEL') {
      this.downloadExcel();
    } else if (format === 'PDF') {
      this.generatePDF();
    }
  }

  private downloadCSV() {
    const headers = ['Vehicule', 'Chauffeur', 'Statut', 'Missions Realisees', 'Distance (km)', 'Vitesse Moyenne (km/h)', 'Ponctualite (%)', 'Alertes Detectees', 'Carburant Estime (L)'];
    const rows = this.filteredReports.map(r => [
      `"${r.vehicleReg}"`,
      `"${r.driverName}"`,
      `"${r.category === 'ACTIVE' ? 'En mission' : (r.category === 'AVAILABLE' ? 'Disponible' : 'Autre')}"`,
      r.totalMissions,
      r.totalKm,
      r.avgSpeedKph,
      `${r.ontimePercent}%`,
      r.alertsCount,
      r.fuelEstimatedLiters
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `geofleet_rapport_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toast.success('Export CSV généré et téléchargé avec succès !');
  }

  private downloadExcel() {
    const headers = ['Véhicule', 'Chauffeur', 'Statut', 'Missions Réalisées', 'Distance (km)', 'Vitesse Moy. (km/h)', 'Ponctualité (%)', 'Alertes', 'Carburant (L)'];
    const rows = this.filteredReports.map(r => [
      r.vehicleReg,
      r.driverName,
      r.category === 'ACTIVE' ? 'En mission' : (r.category === 'AVAILABLE' ? 'Disponible' : 'Autre'),
      r.totalMissions,
      r.totalKm,
      r.avgSpeedKph,
      `${r.ontimePercent}%`,
      r.alertsCount,
      r.fuelEstimatedLiters
    ]);

    const tsvContent = '\uFEFF' + [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\r\n');
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `geofleet_synthese_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.toast.success('Feuille Excel (XLSX/XLS) téléchargée avec succès !');
  }

  private generatePDF() {
    this.toast.info('Préparation de l\'impression du rapport PDF...');
    setTimeout(() => {
      window.print();
    }, 250);
  }
}
