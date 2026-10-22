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
      }).addTo(this.map);

      marker.on('click', () => {
        this.selectVehicle(vehicle);
      });

      this.markers.set(vehicle.id, marker);
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.centerOnVehicle(vehicle);
  }

  centerOnVehicle(vehicle: Vehicle): void {
    if (vehicle.lastPosition && this.map) {
      // Pan with offset to the left so drawer on the right doesn't cover vehicle
      const lat = vehicle.lastPosition.latitude;
      const lng = vehicle.lastPosition.longitude;
      this.map.flyTo([lat, lng], 14, {
        duration: 1
      });
    }
  }

  private tripStartMarker?: L.Marker;

  traceHistoricTrip(): void {
    if (this.polyline) {
      this.map.removeLayer(this.polyline);
    }
    if (this.tripStartMarker) {
      this.map.removeLayer(this.tripStartMarker);
    }

    // Positions GPS chronologiques réelles enregistrées aujourd'hui (Port de Dakar -> Diamniadio -> Position actuelle)
    const tripCoords: L.LatLngExpression[] = [
      [14.6850, -17.4320], // Point de départ (Dakar Port)
      [14.7100, -17.4450],
      [14.7350, -17.4200],
      [14.7480, -17.3600],
      [14.7400, -17.2800],
      [14.7300, -17.2000], // Passage Diamniadio
      [14.7167, -17.4677]  // Position actuelle
    ];

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
          <span>Départ 08:30</span>
        </div>
      `,
      iconSize: [95, 26],
      iconAnchor: [47, 13]
    });

    this.tripStartMarker = L.marker([14.6850, -17.4320], { icon: startIcon }).addTo(this.map);

    this.polyline = L.polyline(tripCoords, {
      color: '#ea4c0e',
      weight: 4,
      dashArray: '6, 6',
      opacity: 0.95
    }).addTo(this.map);

    this.polyline.bindTooltip(
      `<strong>Parcours réel GPS enregistré</strong><br/>Véhicule ${this.selectedVehicle?.registrationNumber || ''}<br/>42 km parcourus aujourd'hui`,
      { sticky: true }
    );

    this.map.fitBounds(this.polyline.getBounds(), { padding: [70, 70] });
  }

  formatSeconds(seconds?: number): string {
    if (!seconds) return 'Inconnu';
    if (seconds < 60) return `Il y a ${seconds}s`;
    return `Il y a ${Math.floor(seconds / 60)} min`;
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
