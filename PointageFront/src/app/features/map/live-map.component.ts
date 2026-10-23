import { Component, AfterViewInit, inject, OnDestroy, ElementRef, ViewChild, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { MockDataService } from '../../core/services/mock-data.service';
import { Vehicle, GeoSite, VehicleType } from '../../core/models/fleet.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ThemeService } from '../../core/services/theme.service';
import { escapeHtml } from '../../shared/utils/security.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './live-map.component.html',
  styleUrl: './live-map.component.scss'
})
export class LiveMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private mockService = inject(MockDataService);
  private route = inject(ActivatedRoute);
  themeService = inject(ThemeService);

  private map!: L.Map;
  private markers: Map<string, L.Marker> = new Map();
  private siteCircles: L.Circle[] = [];
  private siteMarkers: L.Marker[] = [];
  private polyline?: L.Polyline;

  vehicles: Vehicle[] = [];
  geoSites: GeoSite[] = [];
  selectedVehicle: Vehicle | null = null;
  filterStatus: string = 'ALL';

  // Mode Salle d'Opérations & Grand Écran TV
  isWallboardFullscreen = false;
  showSitesLayer = true;

  private tileLayer!: L.TileLayer;
  private sub?: Subscription;
  private sitesSub?: Subscription;

  // Tuiles OpenStreetMap 100% gratuites sans clé API requise
  private readonly osmTilesUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  constructor() {
    // Réaction au changement de thème pour rafraîchir les pins
    effect(() => {
      this.themeService.isDark();
      this.renderVehicleMarkers();
      if (this.showSitesLayer) {
        this.renderGeofenceSites();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.loadSitesAndVehicles();
  }

  private initMap(): void {
    // Centre initial : Dakar & Région métropolitaine
    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false // Déplacé pour l'esthétique du Wallboard
    }).setView([14.7250, -17.4350], 12);

    // Contrôles de zoom repositionnés en haut à droite
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.tileLayer = L.tileLayer(this.osmTilesUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributeurs',
      maxZoom: 19
    }).addTo(this.map);
  }


  toggleMapTheme(): void {
    this.themeService.toggle();
  }

  toggleWallboardFullscreen(): void {
    this.isWallboardFullscreen = !this.isWallboardFullscreen;
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  toggleSitesLayer(): void {
    this.showSitesLayer = !this.showSitesLayer;
    if (this.showSitesLayer) {
      this.renderGeofenceSites();
    } else {
      this.clearGeofenceSites();
    }
  }

  private loadSitesAndVehicles(): void {
    // 1. Charger les Sites Favoris / Géofencing (Phase 3)
    this.sitesSub = this.mockService.getGeoSites().subscribe(sites => {
      this.geoSites = sites;
      if (this.showSitesLayer) {
        this.renderGeofenceSites();
      }
    });

    // 2. Charger les Véhicules avec GPS
    this.sub = this.mockService.getVehicles().subscribe(data => {
      this.vehicles = data;
      this.renderVehicleMarkers();

      const targetVehicleId = this.route.snapshot.queryParams['vehicle'];
      if (targetVehicleId) {
        const v = this.vehicles.find(item => item.id === targetVehicleId);
        if (v) {
          this.selectVehicle(v);
        }
      }
    });
  }

  get displayedVehicles(): Vehicle[] {
    if (this.filterStatus === 'ALL') return this.vehicles;
    return this.vehicles.filter(v => v.status === this.filterStatus);
  }

  get movingVehiclesCount(): number {
    return this.vehicles.filter(v => v.lastPosition && v.lastPosition.speedKph > 0).length;
  }

  setFilter(status: string): void {
    this.filterStatus = status;
    this.renderVehicleMarkers();
  }

  isSignalStale(seconds?: number): boolean {
    return !!seconds && seconds > 300;
  }

  private getVehicleTypeIcon(type: VehicleType): string {
    switch (type) {
      case 'MOTO':
      case 'SCOOTER': return 'two_wheeler';
      case 'TRICYCLE': return 'electric_rickshaw';
      case 'CAMION': return 'rv_hookup';
      case 'FOURGONNETTE': return 'local_shipping';
      case 'PICKUP': return 'directions_car';
      case 'BERLINE': return 'commute';
      default: return 'directions_car';
    }
  }

  private renderGeofenceSites(): void {
    this.clearGeofenceSites();
    if (!this.map) return;

    this.geoSites.forEach(site => {
      // 1. Cercle de détection géofencing (15m à 35m)
      const circle = L.circle([site.latitude, site.longitude], {
        radius: site.radiusMeters,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.22,
        weight: 2,
        dashArray: '4, 4'
      }).addTo(this.map);

      circle.bindTooltip(
        `<strong>📍 ${site.name}</strong><br/>Rayon télématique : ${site.radiusMeters}m<br/>Arrêt min. : ${site.minStopDurationMinutes} min`,
        { direction: 'top' }
      );
      this.siteCircles.push(circle);

      // 2. Marqueur icône du site
      const siteIcon = L.divIcon({
        className: 'custom-telematics-pin',
        html: `
          <div class="pin-site">
            <span class="material-symbols-outlined site-icon" aria-hidden="true">pin_drop</span>
          </div>
        `,
        iconSize: [0, 0]
      });

      const safeName = escapeHtml(site.name);
      const safeAddress = escapeHtml(site.address);

      const marker = L.marker([site.latitude, site.longitude], { icon: siteIcon }).addTo(this.map);
      marker.bindPopup(`
        <div class="popup-site-content">
          <h3 class="popup-site-title">${safeName}</h3>
          <p class="popup-site-desc">${safeAddress}</p>
          <div class="popup-site-radius">Périmètre : ${site.radiusMeters} mètres</div>
        </div>
      `);
      this.siteMarkers.push(marker);
    });
  }

  private clearGeofenceSites(): void {
    if (this.map) {
      this.siteCircles.forEach(c => this.map.removeLayer(c));
      this.siteMarkers.forEach(m => this.map.removeLayer(m));
    }
    this.siteCircles = [];
    this.siteMarkers = [];
  }

  private renderVehicleMarkers(): void {
    if (!this.map) return;

    // Supprimer les anciens marqueurs
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers.clear();

    this.displayedVehicles.forEach(vehicle => {
      if (!vehicle.lastPosition) return;

      const isStale = this.isSignalStale(vehicle.lastPosition.freshnessSeconds);
      const isMoving = vehicle.lastPosition.speedKph > 0;
      const typeIcon = this.getVehicleTypeIcon(vehicle.type);

      // Couleurs adaptées au Wallboard
      let pinColor = '#10b981'; // Vert : en mouvement
      if (vehicle.status === 'MAINTENANCE') {
        pinColor = '#f59e0b';
      } else if (!isMoving) {
        pinColor = '#3b82f6'; // Bleu : immobile / disponible
      }

      if (isStale) {
        pinColor = '#64748b'; // Gris : signal muet
      }

      const safeReg = escapeHtml(vehicle.registrationNumber);

      // Création du marqueur télématique responsive
      const customIcon = L.divIcon({
        className: 'custom-telematics-pin',
        html: `
          <div class="pin-vehicle" style="--pin: ${pinColor};">
            <span class="material-symbols-outlined pin-icon" aria-hidden="true">${typeIcon}</span>
            <span>${safeReg}</span>
            <span class="pin-speed">${vehicle.lastPosition.speedKph} km/h</span>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker([vehicle.lastPosition.latitude, vehicle.lastPosition.longitude], {
        icon: customIcon
      });

      if (!this.isTripTraceActive || vehicle.id === this.selectedVehicle?.id) {
        marker.addTo(this.map);
      }

      marker.on('click', () => {
        this.selectVehicle(vehicle);
      });

      this.markers.set(vehicle.id, marker);
    });
  }

  isTripTraceActive = false;
  private tripStartMarker?: L.Marker;

  selectVehicle(vehicle: Vehicle): void {
    if (this.selectedVehicle?.id !== vehicle.id) {
      this.clearHistoricTrip();
    }
    this.selectedVehicle = vehicle;
    this.centerOnVehicle(vehicle);
  }

  deselectVehicle(): void {
    this.selectedVehicle = null;
    this.clearHistoricTrip();
  }

  centerOnVehicle(vehicle: Vehicle): void {
    if (vehicle.lastPosition && this.map) {
      const lat = vehicle.lastPosition.latitude;
      const lng = vehicle.lastPosition.longitude;
      this.map.flyTo([lat, lng], 14, {
        duration: 1
      });
    }
  }

  toggleHistoricTrip(): void {
    if (this.isTripTraceActive) {
      this.clearHistoricTrip();
    } else {
      this.traceHistoricTrip();
    }
  }

  clearHistoricTrip(): void {
    if (this.polyline && this.map) {
      this.map.removeLayer(this.polyline);
      this.polyline = undefined;
    }
    if (this.tripStartMarker && this.map) {
      this.map.removeLayer(this.tripStartMarker);
      this.tripStartMarker = undefined;
    }
    this.isTripTraceActive = false;

    if (this.map) {
      this.markers.forEach(marker => {
        if (!this.map.hasLayer(marker)) {
          marker.addTo(this.map);
        }
      });
    }
  }

  traceHistoricTrip(): void {
    this.clearHistoricTrip();
    if (!this.selectedVehicle) return;

    let tripCoords: L.LatLngExpression[] = [];
    let startLabel = 'Départ 08:30';

    if (this.selectedVehicle.id === 'v2') {
      tripCoords = [
        [14.7300, -17.4400],
        [14.7150, -17.4480],
        [14.7000, -17.4420],
        [14.6850, -17.4350],
        [14.7392, -17.4520]
      ];
      startLabel = 'Départ 07:45';
    } else if (this.selectedVehicle.id === 'v3') {
      tripCoords = [
        [14.7880, -16.9320],
        [14.7910, -16.9280],
        [14.7930, -16.9260]
      ];
      startLabel = 'Départ 06:15';
    } else {
      tripCoords = [
        [14.6850, -17.4320],
        [14.7100, -17.4450],
        [14.7350, -17.4200],
        [14.7480, -17.3600],
        [14.7400, -17.2800],
        [14.7300, -17.2000],
        [14.7167, -17.4677]
      ];
    }

    const startPos = tripCoords[0] as [number, number];

    const safeStartLabel = escapeHtml(startLabel);
    const startIcon = L.divIcon({
      className: 'custom-telematics-pin',
      html: `
        <div class="pin-start">
          <span class="material-symbols-outlined flag-icon" aria-hidden="true">flag</span>
          <span>${safeStartLabel}</span>
        </div>
      `,
      iconSize: [0, 0]
    });

    this.tripStartMarker = L.marker(startPos, { icon: startIcon }).addTo(this.map);

    this.polyline = L.polyline(tripCoords, {
      color: '#ea4c0e',
      weight: 4,
      dashArray: '6, 6',
      opacity: 0.95
    }).addTo(this.map);

    const safeVehicleReg = escapeHtml(this.selectedVehicle.registrationNumber);
    this.polyline.bindTooltip(
      `<strong>Parcours réel GPS</strong><br/>Véhicule ${safeVehicleReg}`,
      { sticky: true }
    );

    this.isTripTraceActive = true;

    if (this.map) {
      this.markers.forEach((marker, vehicleId) => {
        if (vehicleId !== this.selectedVehicle?.id && this.map.hasLayer(marker)) {
          this.map.removeLayer(marker);
        }
      });
    }

    this.map.fitBounds(this.polyline.getBounds(), { padding: [70, 70] });
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  formatSeconds(seconds?: number): string {
    if (!seconds) return 'Inconnu';
    if (seconds < 60) return `Il y a ${seconds}s`;
    return `Il y a ${Math.floor(seconds / 60)} min`;
  }

  ngOnDestroy(): void {
    this.clearHistoricTrip();
    this.clearGeofenceSites();
    this.sub?.unsubscribe();
    this.sitesSub?.unsubscribe();
  }
}
