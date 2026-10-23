import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { GeoSite, SiteCategory, SiteVisitLog } from '../../core/models/fleet.models';

import { ModalA11yDirective } from '../../shared/directives/modal-a11y.directive';

@Component({
  selector: 'app-sites-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PageHeaderComponent, ModalA11yDirective],
  templateUrl: './sites-management.component.html',
  styleUrl: './sites-management.component.scss'
})
export class SitesManagementComponent {
  private mockService = inject(MockDataService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  user$ = this.authService.currentUser$;
  geoSites$ = this.mockService.getGeoSites();
  siteVisits$ = this.mockService.getSiteVisits();

  activeTab: 'SITES' | 'PASSAGES' = 'SITES';
  selectedCategoryFilter: string = 'TOUS';

  // Modal Ajout de Site Favori
  isAddModalOpen = false;
  newSite = {
    name: '',
    category: 'DEPOT_CLIENT' as SiteCategory,
    address: '',
    latitude: 14.7167,
    longitude: -17.4677,
    radiusMeters: 25, // Préconisation 15m - 30m
    minStopDurationMinutes: 2, // Arrêt mini 2 minutes pour confirmer un arrêt réel
    contactName: '',
    contactPhone: '',
    notes: ''
  };

  getCategoryLabel(category: SiteCategory): string {
    switch (category) {
      case 'DEPOT_CLIENT': return 'Dépôt / Client';
      case 'STATION_SERVICE': return 'Station-Service (Total)';
      case 'PORT_LOGISTIQUE': return 'Port & Logistique';
      case 'USINE_CHANTIER': return 'Usine & Chantier';
      case 'SIEGE_ENTREPRISE': return 'Siège & Base';
      default: return category;
    }
  }

  getCategoryIcon(category: SiteCategory): string {
    switch (category) {
      case 'DEPOT_CLIENT': return 'storefront';
      case 'STATION_SERVICE': return 'local_gas_station';
      case 'PORT_LOGISTIQUE': return 'anchor';
      case 'USINE_CHANTIER': return 'factory';
      case 'SIEGE_ENTREPRISE': return 'domain';
      default: return 'location_on';
    }
  }

  openAddModal() {
    this.newSite = {
      name: '',
      category: 'DEPOT_CLIENT',
      address: '',
      latitude: 14.7167,
      longitude: -17.4677,
      radiusMeters: 25,
      minStopDurationMinutes: 2,
      contactName: '',
      contactPhone: '',
      notes: ''
    };
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  saveSite() {
    if (!this.newSite.name || !this.newSite.address || !this.newSite.radiusMeters) {
      this.toast.error('Veuillez renseigner le libellé, l\'adresse et le rayon de détection.');
      return;
    }

    if (this.newSite.radiusMeters < 10 || this.newSite.radiusMeters > 200) {
      this.toast.error('Le rayon de géofencing doit être compris entre 10 et 200 mètres (idéalement 15m - 30m).');
      return;
    }

    this.mockService.addGeoSite(this.newSite);
    this.toast.success(`Site favori "${this.newSite.name}" ajouté avec succès au système de géofencing.`);
    this.isAddModalOpen = false;
  }
}
