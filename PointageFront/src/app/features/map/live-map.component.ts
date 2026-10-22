import { Component, AfterViewInit, inject, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as L from 'leaflet';
import { MockDataService } from '../../core/services/mock-data.service';
import { Vehicle } from '../../core/models/fleet.models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
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

  private map!: L.Map;
  private markers: Map<string, L.Marker> = new Map();
  private polyline?: L.Polyline;

  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  filterStatus: string = 'ALL';

  private sub?: Subscription;

  ngAfterViewInit(): void {
    this.initMap();
    this.loadVehiclesAndListenParams();
  }

  private initMap(): void {
    // Center initially on Dakar / Sénégal region
    this.map = L.map(this.mapContainer.nativeElement).setView([14.7167, -17.4677], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributeurs'
    }).addTo(this.map);
  }

  private loadVehiclesAndListenParams(): void {
    // Single combined subscription to avoid nested memory leak
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

  setFilter(status: string): void {
    this.filterStatus = status;
    this.renderVehicleMarkers();
  }

  isSignalStale(seconds?: number): boolean {
    return !!seconds && seconds > 300;
  }

  private renderVehicleMarkers(): void {
    if (!this.map) return;

    // Clear old markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers.clear();

    this.displayedVehicles.forEach(vehicle => {
      if (!vehicle.lastPosition) return;

      const isStale = this.isSignalStale(vehicle.lastPosition.freshnessSeconds);
      const isEnMission = vehicle.status === 'EN_MISSION';

      let bgColor = isEnMission ? 'var(--info)' : (vehicle.status === 'DISPONIBLE' ? 'var(--ok)' : 'var(--warn)');
      let textDecoration = 'none';
      let opacity = '1';

      if (isStale) {
        bgColor = '#64748b';
        textDecoration = 'line-through';
        opacity = '0.75';
      }

      const customIcon = L.divIcon({
        className: 'custom-vehicle-pin',
        html: `
          <div style="
            background: ${bgColor};
            color: #ffffff;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 4px;
            border: 2px solid #ffffff;
            opacity: ${opacity};
            text-decoration: ${textDecoration};
            cursor: pointer;
            white-space: nowrap;
          ">
            <span class="material-symbols-outlined" style="font-size: 14px;">directions_car</span>
            <span>${vehicle.registrationNumber}</span>
          </div>
        `,
        iconSize: [110, 30],
        iconAnchor: [55, 15]
      });

      const marker = L.marker([vehicle.lastPosition.latitude, vehicle.lastPosition.longitude], {
        icon: customIcon
      });

      // Si un tracé est en cours, n'afficher sur la carte que le véhicule sélectionné
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

    // Réafficher tous les autres véhicules sur la carte
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

    // Coordonnées spécifiques selon le véhicule
    let tripCoords: L.LatLngExpression[] = [];
    let startLabel = 'Départ 08:30';

    if (this.selectedVehicle.id === 'v2') {
      tripCoords = [
        [14.7300, -17.4400], // Bel-Air
        [14.7150, -17.4480],
        [14.7000, -17.4420],
        [14.6850, -17.4350],
        [14.7392, -17.4520]  // Position actuelle
      ];
      startLabel = 'Départ 07:45';
    } else if (this.selectedVehicle.id === 'v3') {
      tripCoords = [
        [14.7880, -16.9320], // Thiès
        [14.7910, -16.9280],
        [14.7930, -16.9260]  // Position actuelle Thiès
      ];
      startLabel = 'Départ 06:15';
    } else {
      // Par défaut v1 (Port de Dakar -> Diamniadio -> Position actuelle)
      tripCoords = [
        [14.6850, -17.4320], // Point de départ (Dakar Port)
        [14.7100, -17.4450],
        [14.7350, -17.4200],
        [14.7480, -17.3600],
        [14.7400, -17.2800],
        [14.7300, -17.2000], // Passage Diamniadio
        [14.7167, -17.4677]  // Position actuelle
      ];
    }

    const startPos = tripCoords[0] as [number, number];

    // Marqueur du point de départ réel
    const startIcon = L.divIcon({
      className: 'start-pin',
      html: `
        <div style="
          background: #047857;
          color: white;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid white;
          display: flex;
          align-items: center;
          gap: 3px;
        ">
          <span class="material-symbols-outlined" style="font-size: 13px;">flag</span>
          <span>${startLabel}</span>
        </div>
      `,
      iconSize: [95, 26],
      iconAnchor: [47, 13]
    });

    this.tripStartMarker = L.marker(startPos, { icon: startIcon }).addTo(this.map);

    this.polyline = L.polyline(tripCoords, {
      color: '#ea4c0e',
      weight: 4,
      dashArray: '6, 6',
      opacity: 0.95
    }).addTo(this.map);

    this.polyline.bindTooltip(
      `<strong>Parcours réel GPS</strong><br/>Véhicule ${this.selectedVehicle.registrationNumber}<br/>Trajet affiché à la demande`,
      { sticky: true }
    );

    this.isTripTraceActive = true;

    // Masquer tous les autres véhicules sur la carte
    if (this.map) {
      this.markers.forEach((marker, vehicleId) => {
        if (vehicleId !== this.selectedVehicle?.id && this.map.hasLayer(marker)) {
          this.map.removeLayer(marker);
        }
      });
    }

    this.map.fitBounds(this.polyline.getBounds(), { padding: [70, 70] });
  }

  formatSeconds(seconds?: number): string {
    if (!seconds) return 'Inconnu';
    if (seconds < 60) return `Il y a ${seconds}s`;
    return `Il y a ${Math.floor(seconds / 60)} min`;
  }

  ngOnDestroy(): void {
    this.clearHistoricTrip();
    this.sub?.unsubscribe();
  }
}
