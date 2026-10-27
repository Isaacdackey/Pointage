import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { AuthService } from '../../core/services/auth.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { GeoSite, SiteCategory, SiteVisitLog } from '../../core/models/fleet.models';
import * as L from 'leaflet';

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
    category: 'DEPOT' as SiteCategory,
    address: '',
    latitude: 14.7167,
    longitude: -17.4677,
    radiusMeters: 25, // Préconisation 15m - 30m
    minStopDurationMinutes: 2, // Arrêt mini 2 minutes pour confirmer un arrêt réel
    contactName: '',
    contactPhone: '',
    notes: ''
  };

  // Mini-carte Leaflet pour sélection par clic direct
  private pickerMap?: L.Map;
  private pickerMarker?: L.Marker;
  private pickerCircle?: L.Circle;
  isGeocodingLoading = false;

  getCategoryLabel(category: SiteCategory): string {
    switch (category) {
      case 'DEPOT': return 'Dépôt (Départ / Magasin)';
      case 'CLIENT': return 'Client (Destination / Livraison)';
      case 'AUTRE': return 'Autre site';
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
      case 'DEPOT': return 'warehouse';
      case 'CLIENT': return 'storefront';
      case 'AUTRE': return 'pin_drop';
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
      category: 'DEPOT',
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

    // Initialisation de la mini-carte Leaflet dès que la modale est rendue
    setTimeout(() => {
      this.initPickerMap();
    }, 200);
  }

  closeAddModal() {
    this.isAddModalOpen = false;
    if (this.pickerMap) {
      this.pickerMap.remove();
      this.pickerMap = undefined;
      this.pickerMarker = undefined;
      this.pickerCircle = undefined;
    }
  }

  private initPickerMap(): void {
    const container = document.getElementById('site-picker-map');
    if (!container) return;

    if (this.pickerMap) {
      this.pickerMap.remove();
    }

    const defaultLat = this.newSite.latitude;
    const defaultLng = this.newSite.longitude;

    this.pickerMap = L.map('site-picker-map', {
      zoomControl: true
    }).setView([defaultLat, defaultLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(this.pickerMap);

    const pinIcon = L.divIcon({
      className: 'picker-pin-wrapper',
      html: `
        <div style="background: #ea4c0e; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.3); border: 2px solid white;">
          <span class="material-symbols-outlined" style="font-size: 20px;">pin_drop</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    this.pickerMarker = L.marker([defaultLat, defaultLng], {
      icon: pinIcon,
      draggable: true
    }).addTo(this.pickerMap);

    this.pickerCircle = L.circle([defaultLat, defaultLng], {
      radius: this.newSite.radiusMeters,
      color: '#ea4c0e',
      fillColor: '#ea4c0e',
      fillOpacity: 0.2,
      weight: 2
    }).addTo(this.pickerMap);

    // Clic n'importe où sur la carte = déplace le pin et met à jour les coordonnées
    this.pickerMap.on('click', (e: L.LeafletMouseEvent) => {
      this.updatePickedLocation(e.latlng.lat, e.latlng.lng);
    });

    // Déplacement manuel du marqueur par glisser-déposer
    this.pickerMarker.on('dragend', () => {
      const pos = this.pickerMarker?.getLatLng();
      if (pos) {
        this.updatePickedLocation(pos.lat, pos.lng);
      }
    });

    // Invalider la taille pour affichage parfait dans le modal
    setTimeout(() => {
      this.pickerMap?.invalidateSize();
    }, 250);
  }

  updatePickedLocation(lat: number, lng: number): void {
    this.newSite.latitude = parseFloat(lat.toFixed(6));
    this.newSite.longitude = parseFloat(lng.toFixed(6));

    if (this.pickerMarker) {
      this.pickerMarker.setLatLng([lat, lng]);
    }
    if (this.pickerCircle) {
      this.pickerCircle.setLatLng([lat, lng]);
    }

    // Récupérer automatiquement l'adresse par géocodage inverse gratuit (Nominatim OSM)
    this.reverseGeocode(lat, lng);
  }

  onRadiusChange(): void {
    if (this.pickerCircle && this.newSite.radiusMeters) {
      this.pickerCircle.setRadius(this.newSite.radiusMeters);
    }
  }

  private reverseGeocode(lat: number, lng: number): void {
    this.isGeocodingLoading = true;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.isGeocodingLoading = false;
        if (data && data.display_name) {
          this.newSite.address = data.display_name;
          // Si le champ nom est encore vide, suggérer le quartier/ville
          if (!this.newSite.name) {
            const road = data.address?.road || data.address?.suburb || data.address?.city || '';
            if (road) {
              const prefix = this.newSite.category === 'DEPOT' ? 'Dépôt ' : 'Client ';
              this.newSite.name = `${prefix}${road}`;
            }
          }
        }
      })
      .catch(() => {
        this.isGeocodingLoading = false;
      });
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
    this.closeAddModal();
  }
}
