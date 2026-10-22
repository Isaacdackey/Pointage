import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, StatusBadgeComponent],
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

  formatNumber(val: number): string {
    return val.toLocaleString('fr-FR');
  }

  openAddModal() {
    this.toast.info("Formulaire d'enregistrement de véhicule : affectation traceur et chauffeur.");
  }
}
