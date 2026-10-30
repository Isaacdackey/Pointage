import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MockDataService } from '../../core/services/mock-data.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { ToastService } from '../../shared/services/toast.service';
import { Mission, GeoSite } from '../../core/models/fleet.models';
import * as L from 'leaflet';

export type MissionSortField = 'anomalies' | 'code' | 'plannedStartTime' | 'status';

@Component({
  selector: 'app-missions-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    StatusBadgeComponent,
    ConfirmDialogComponent,
    RelativeTimePipe
  ],
  templateUrl: './missions-list.component.html',
  styleUrl: './missions-list.component.scss'
})
export class MissionsListComponent implements OnInit, OnDestroy {
  private mockService = inject(MockDataService);
  private toast = inject(ToastService);

  missions$ = this.mockService.getMissions();
  vehicles$ = this.mockService.getVehicles();
  drivers$ = this.mockService.getDrivers();
  geoSites$ = this.mockService.getGeoSites();

  // Indicateur Live "Mis à jour il y a Xs"
  secondsSinceLastUpdate = 0;
  private updateTimer: any;
  isRefreshing = false;

  // Bandeau télématique fermable avec mémorisation dans localStorage
  isBannerVisible = true;

  // Filtres, recherche et tri
  statusFilter: 'TOUTES' | 'PLANIFIEE' | 'EN_COURS' | 'EN_ANOMALIE' | 'TERMINEE' = 'TOUTES';
  searchQuery: string = '';
  sortBy: MissionSortField = 'anomalies';
  sortAscending = true;

  // Pagination
  currentPage = 1;
  pageSize = 6;

  // Modale de confirmation manuelle (Forcer départ / Terminer)
  confirmModalOpen = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalType: 'ok' | 'warn' | 'danger' | 'info' = 'warn';
  confirmModalAction: (() => void) | null = null;
  confirmModalBtnLabel = 'Confirmer';

  // Carte interactive d'aperçu et pointage dans la modale
  private missionMap?: L.Map;
  private originMarker?: L.Marker;
  private destMarker?: L.Marker;
  private routeLine?: L.Polyline;
  activePickingMode: 'ORIGIN' | 'DEST' = 'ORIGIN';
  originCoords: { lat: number; lng: number } = { lat: 14.7167, lng: -17.4677 };
  destCoords: { lat: number; lng: number } = { lat: 14.7410, lng: -17.3240 };
  // Modal Planifier une Tournée / Mission
  isModalOpen = false;
  newMission = {
    title: '',
    vehicleId: '',
    driverId: '',
    originSiteId: '',
    originName: '',
    destinationSiteId: '',
    destinationName: '',
    distanceKm: 0,
    plannedStartTime: '',
    notes: ''
  };
  isGeocodingLoading = false;

  // Autocomplete recherche d'adresse prédictive
  originSearchQuery = '';
  destSearchQuery = '';
  originSuggestions: Array<{ label: string; sublabel?: string; lat: number; lng: number; isFavorite?: boolean; siteId?: string }> = [];
  destSuggestions: Array<{ label: string; sublabel?: string; lat: number; lng: number; isFavorite?: boolean; siteId?: string }> = [];
  isSearchingOrigin = false;
  isSearchingDest = false;
  private originSearchTimeout: any;
  private destSearchTimeout: any;

  // Répertoire des principaux repères et carrefours du Sénégal / Dakar
  private readonly defaultLocations: Array<{ label: string; sublabel: string; lat: number; lng: number }> = [
    { label: 'ISM Point E (Institut Supérieur de Management)', sublabel: 'Avenue Cheikh Anta Diop, Point E, Dakar', lat: 14.6925, lng: -17.4642 },
    { label: 'Total Almadies', sublabel: 'Route des Almadies, Ngor, Dakar', lat: 14.7431, lng: -17.5186 },
    { label: 'Port Autonome de Dakar (DP World)', sublabel: 'Boulevard de la Libération, Dakar Plateau', lat: 14.6780, lng: -17.4290 },
    { label: 'Plateforme Industrielle Internationale de Diamniadio (P2ID)', sublabel: 'Diamniadio, Rufisque', lat: 14.7215, lng: -17.1852 },
    { label: 'Aéroport International Blaise Diagne (AIBD)', sublabel: 'Diass, Thiès', lat: 14.6711, lng: -17.0733 },
    { label: 'Grand Yoff (Rond-point Liberté 6)', sublabel: 'Grand Yoff, Dakar', lat: 14.7291, lng: -17.4523 },
    { label: 'Dépôt Central Pétrolier Hann Bel-Air', sublabel: 'Route des Hydrocarbures, Bel-Air, Dakar', lat: 14.7167, lng: -17.4277 },
    { label: 'Pharmacie Guigon Dakar Plateau', sublabel: 'Avenue Georges Pompidou, Dakar', lat: 14.6698, lng: -17.4334 },
    { label: 'Gare des Baux Maraîchers', sublabel: 'Pikine Est, Dakar', lat: 14.7456, lng: -17.3871 },
    { label: 'Centre Commercial Sea Plaza', sublabel: 'Boulevard Martin Luther King (Corniche Ouest), Dakar', lat: 14.6865, lng: -17.4764 },
    { label: 'Université Cheikh Anta Diop (UCAD)', sublabel: 'Fann Résidence, Dakar', lat: 14.6918, lng: -17.4669 },
    { label: 'Péage Dakar Diamniadio (Gare Thiaroye)', sublabel: 'Autoroute de l\'Avenir, Thiaroye', lat: 14.7554, lng: -17.3682 },
    { label: 'Hôpital Principal de Dakar', sublabel: 'Avenue Nelson Mandela, Plateau', lat: 14.6612, lng: -17.4339 },
    { label: 'Monument de la Renaissance Africaine', sublabel: 'Ouakam, Dakar', lat: 14.7222, lng: -17.4950 },
    { label: 'Saly Portudal', sublabel: 'Mbour, Thiès', lat: 14.4422, lng: -16.9856 }
  ];

  ngOnInit(): void {
    // Lecture de la préférence du bandeau
    try {
      const bannerPref = localStorage.getItem('geofleet_missions_banner_hidden');
      if (bannerPref === 'true') {
        this.isBannerVisible = false;
      }
    } catch {
      // Fallback si localStorage désactivé ou privé
      this.isBannerVisible = true;
    }

    // Timer d'indicateur live (mis à jour chaque seconde)
    this.updateTimer = setInterval(() => {
      this.secondsSinceLastUpdate++;
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }
  }

  // Fermeture du bandeau avec persistance
  closeBanner(): void {
    this.isBannerVisible = false;
    try {
      localStorage.setItem('geofleet_missions_banner_hidden', 'true');
    } catch {
      // Ignore
    }
  }

  // Actualisation manuelle / Pull-to-refresh
  refreshData(): void {
    this.isRefreshing = true;
    setTimeout(() => {
      this.secondsSinceLastUpdate = 0;
      this.isRefreshing = false;
      this.toast.info('Données télématiques actualisées en temps réel.');
    }, 500);
  }

  // Calcul dynamique des compteurs de statuts
  getStatusCounts(missions: Mission[] | null): { toutes: number; planifiees: number; enCours: number; anomalies: number; terminees: number } {
    if (!missions) return { toutes: 0, planifiees: 0, enCours: 0, anomalies: 0, terminees: 0 };
    return {
      toutes: missions.length,
      planifiees: missions.filter(m => m.status === 'PLANIFIEE').length,
      enCours: missions.filter(m => m.status === 'EN_COURS').length,
      anomalies: missions.filter(m => m.status === 'EN_ANOMALIE').length,
      terminees: missions.filter(m => m.status === 'TERMINEE').length
    };
  }

  // Filtrage et Tri
  filterAndSortMissions(missions: Mission[] | null): Mission[] {
    if (!missions) return [];

    let result = missions.filter(m => {
      // 1. Filtre statut
      if (this.statusFilter === 'EN_COURS') {
        // Le filtre "En cours" inclut aussi les anomalies opérationnelles en mission
        if (m.status !== 'EN_COURS' && m.status !== 'EN_ANOMALIE') return false;
      } else if (this.statusFilter !== 'TOUTES') {
        if (m.status !== this.statusFilter) return false;
      }

      // 2. Recherche textuelle
      if (!this.searchQuery.trim()) return true;
      const q = this.searchQuery.toLowerCase().trim();
      return (
        m.code.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.vehicleReg.toLowerCase().includes(q) ||
        m.driverName.toLowerCase().includes(q) ||
        m.originName.toLowerCase().includes(q) ||
        m.destinationName.toLowerCase().includes(q)
      );
    });

    // 3. Tri
    result = [...result].sort((a, b) => {
      if (this.sortBy === 'anomalies') {
        // Priorité absolue aux missions en anomalie
        const aIsAnomaly = a.status === 'EN_ANOMALIE' ? 1 : 0;
        const bIsAnomaly = b.status === 'EN_ANOMALIE' ? 1 : 0;
        if (aIsAnomaly !== bIsAnomaly) return bIsAnomaly - aIsAnomaly;
        // Puis statut En cours
        const aRunning = a.status === 'EN_COURS' ? 1 : 0;
        const bRunning = b.status === 'EN_COURS' ? 1 : 0;
        if (aRunning !== bRunning) return bRunning - aRunning;
        return (b.plannedStartTime || '').localeCompare(a.plannedStartTime || '');
      }

      let cmp = 0;
      if (this.sortBy === 'code') {
        cmp = a.code.localeCompare(b.code);
      } else if (this.sortBy === 'plannedStartTime') {
        cmp = (a.plannedStartTime || '').localeCompare(b.plannedStartTime || '');
      } else if (this.sortBy === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return this.sortAscending ? cmp : -cmp;
    });

    return result;
  }

  // Pagination sur la liste filtrée
  getPaginatedMissions(missions: Mission[] | null): Mission[] {
    const list = this.filterAndSortMissions(missions);
    const start = (this.currentPage - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  }

  getTotalPages(missions: Mission[] | null): number {
    const total = this.filterAndSortMissions(missions).length;
    return Math.max(1, Math.ceil(total / this.pageSize));
  }

  setPage(page: number, missions: Mission[] | null): void {
    const maxPage = this.getTotalPages(missions);
    if (page >= 1 && page <= maxPage) {
      this.currentPage = page;
    }
  }

  toggleSort(field: MissionSortField): void {
    if (this.sortBy === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = field;
      this.sortAscending = true;
    }
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.statusFilter = 'TOUTES';
    this.searchQuery = '';
    this.sortBy = 'anomalies';
    this.currentPage = 1;
  }

  // Actions sécurisées avec modale de confirmation
  promptForceStart(mission: Mission): void {
    this.confirmModalTitle = 'Démarrer la mission';
    this.confirmModalMessage = `Voulez-vous lancer le départ de la tournée ${mission.code} (${mission.vehicleReg}) ? Normalement, GeoFleet détecte automatiquement le départ dès le premier déplacement GPS.`;
    this.confirmModalType = 'warn';
    this.confirmModalBtnLabel = 'Démarrer la mission';
    this.confirmModalAction = () => {
      this.mockService.acceptDeparture(mission.id);
      this.secondsSinceLastUpdate = 0;
      this.toast.success(`Mission ${mission.code} démarrée manuellement. Surveillance active.`);
    };
    this.confirmModalOpen = true;
  }

  promptForceFinish(mission: Mission): void {
    this.confirmModalTitle = 'Clôturer la mission';
    this.confirmModalMessage = `Êtes-vous certain de vouloir clôturer définitivement la tournée ${mission.code} ? Cette action enregistrera l'arrivée finale et balayera le tracé actif de la carte.`;
    this.confirmModalType = 'ok';
    this.confirmModalBtnLabel = 'Clôturer la tournée';
    this.confirmModalAction = () => {
      this.mockService.validateAndCloseMission(mission.id);
      this.secondsSinceLastUpdate = 0;
      this.toast.success(`Mission ${mission.code} terminée avec succès. Tracé archivé.`);
    };
    this.confirmModalOpen = true;
  }

  onConfirmModalConfirm(): void {
    if (this.confirmModalAction) {
      this.confirmModalAction();
    }
    this.confirmModalOpen = false;
    this.confirmModalAction = null;
  }

  onConfirmModalCancel(): void {
    this.confirmModalOpen = false;
    this.confirmModalAction = null;
  }

  // Calcul automatique de la distance entre deux sites (Formule Haversine)
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // Coefficient de détour routier réel d'environ 1.25x la distance à vol d'oiseau
    return parseFloat((R * c * 1.25).toFixed(1));
  }

  autoComputeDistance(sites: GeoSite[]): void {
    if (!this.newMission.originSiteId || !this.newMission.destinationSiteId) return;
    const origin = sites.find(s => s.id === this.newMission.originSiteId);
    const dest = sites.find(s => s.id === this.newMission.destinationSiteId);
    if (origin && dest) {
      this.newMission.distanceKm = this.calculateDistance(
        origin.latitude,
        origin.longitude,
        dest.latitude,
        dest.longitude
      );
    }
  }

  onOriginSiteChange(siteId: string, sites: GeoSite[]) {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      this.newMission.originName = site.name;
      this.originSearchQuery = site.name;
      this.originCoords = { lat: site.latitude, lng: site.longitude };
      this.updateMapRoute();
    }
    this.autoComputeDistance(sites);
  }

  onDestinationSiteChange(siteId: string, sites: GeoSite[]) {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      this.newMission.destinationName = site.name;
      this.destSearchQuery = site.name;
      this.destCoords = { lat: site.latitude, lng: site.longitude };
      this.updateMapRoute();
    }
    this.autoComputeDistance(sites);
  }

  // --- RECHERCHE PRÉDICTIVE TYPE GOOGLE MAPS ---
  onOriginInput(query: string, sites: GeoSite[]) {
    this.newMission.originName = query;
    if (this.originSearchTimeout) clearTimeout(this.originSearchTimeout);

    if (!query || query.trim().length < 2) {
      this.originSuggestions = [];
      this.isSearchingOrigin = false;
      return;
    }

    const q = query.toLowerCase().trim();

    // 1. Suggestions locales instantanées (Sites favoris + Carrefours Sénégal)
    const localMatches: Array<{ label: string; sublabel?: string; lat: number; lng: number; isFavorite?: boolean; siteId?: string }> = [];

    // Favoris
    sites.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.address && s.address.toLowerCase().includes(q))) {
        localMatches.push({
          label: s.name,
          sublabel: s.address || 'Site favori de la flotte',
          lat: s.latitude,
          lng: s.longitude,
          isFavorite: true,
          siteId: s.id
        });
      }
    });

    // Lieux pré-indexés Dakar/Sénégal
    this.defaultLocations.forEach(loc => {
      if (loc.label.toLowerCase().includes(q) || loc.sublabel.toLowerCase().includes(q)) {
        if (!localMatches.some(m => m.label.toLowerCase() === loc.label.toLowerCase())) {
          localMatches.push({
            label: loc.label,
            sublabel: loc.sublabel,
            lat: loc.lat,
            lng: loc.lng,
            isFavorite: false
          });
        }
      }
    });

    this.originSuggestions = localMatches.slice(0, 5);

    // 2. Debounce recherche en ligne Nominatim OSM
    this.isSearchingOrigin = true;
    this.originSearchTimeout = setTimeout(() => {
      const searchUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query + ' Senegal') + '&limit=4&addressdetails=1';
      fetch(searchUrl)
        .then(res => res.json())
        .then(data => {
          this.isSearchingOrigin = false;
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              const label = item.display_name.split(',')[0];
              const sublabel = item.display_name.split(',').slice(1, 4).join(',').trim();
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);

              if (!this.originSuggestions.some(s => Math.abs(s.lat - lat) < 0.001 && Math.abs(s.lng - lng) < 0.001)) {
                this.originSuggestions.push({
                  label,
                  sublabel,
                  lat,
                  lng,
                  isFavorite: false
                });
              }
            });
            this.originSuggestions = this.originSuggestions.slice(0, 6);
          }
        })
        .catch(() => {
          this.isSearchingOrigin = false;
        });
    }, 400);
  }

  selectOriginSuggestion(item: { label: string; sublabel?: string; lat: number; lng: number; isFavorite?: boolean; siteId?: string }) {
    this.newMission.originName = item.label;
    this.originSearchQuery = item.label;
    this.newMission.originSiteId = item.siteId || '';
    this.originCoords = { lat: item.lat, lng: item.lng };
    this.originSuggestions = [];
    this.updateMapRoute();
  }

  onDestInput(query: string, sites: GeoSite[]) {
    this.newMission.destinationName = query;
    if (this.destSearchTimeout) clearTimeout(this.destSearchTimeout);

    if (!query || query.trim().length < 2) {
      this.destSuggestions = [];
      this.isSearchingDest = false;
      return;
    }

    const q = query.toLowerCase().trim();

    // 1. Suggestions locales instantanées
    const localMatches: Array<{ label: string; sublabel?: string; lat: number; lng: number; isFavorite?: boolean; siteId?: string }> = [];

    // Favoris
    sites.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.address && s.address.toLowerCase().includes(q))) {
        localMatches.push({
          label: s.name,
          sublabel: s.address || 'Site favori de la flotte',
          lat: s.latitude,
          lng: s.longitude,
          isFavorite: true,
          siteId: s.id
        });
      }
    });

    // Lieux Dakar / Sénégal
    this.defaultLocations.forEach(loc => {
      if (loc.label.toLowerCase().includes(q) || loc.sublabel.toLowerCase().includes(q)) {
        if (!localMatches.some(m => m.label.toLowerCase() === loc.label.toLowerCase())) {
          localMatches.push({
            label: loc.label,
            sublabel: loc.sublabel,
            lat: loc.lat,
            lng: loc.lng,
            isFavorite: false
          });
        }
      }
    });

    this.destSuggestions = localMatches.slice(0, 5);

    // 2. Debounce recherche en ligne Nominatim OSM
    this.isSearchingDest = true;
    this.destSearchTimeout = setTimeout(() => {
      const searchUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query + ' Senegal') + '&limit=4&addressdetails=1';
      fetch(searchUrl)
        .then(res => res.json())
        .then(data => {
          this.isSearchingDest = false;
          if (Array.isArray(data)) {
            data.forEach((item: any) => {
              const label = item.display_name.split(',')[0];
              const sublabel = item.display_name.split(',').slice(1, 4).join(',').trim();
              const lat = parseFloat(item.lat);
              const lng = parseFloat(item.lon);

              if (!this.destSuggestions.some(s => Math.abs(s.lat - lat) < 0.001 && Math.abs(s.lng - lng) < 0.001)) {
                this.destSuggestions.push({
                  label,
                  sublabel,
                  lat,
                  lng,
                  isFavorite: false
                });
              }
            });
            this.destSuggestions = this.destSuggestions.slice(0, 6);
          }
        })
        .catch(() => {
          this.isSearchingDest = false;
        });
    }, 400);
  }

  selectDestSuggestion(item: { label: string; sublabel?: string; lat: number; lng: number; isFavorite?: boolean; siteId?: string }) {
    this.newMission.destinationName = item.label;
    this.destSearchQuery = item.label;
    this.newMission.destinationSiteId = item.siteId || '';
    this.destCoords = { lat: item.lat, lng: item.lng };
    this.destSuggestions = [];
    this.updateMapRoute();
  }

  clearOriginSearch() {
    this.originSearchQuery = '';
    this.newMission.originName = '';
    this.newMission.originSiteId = '';
    this.originSuggestions = [];
  }

  clearDestSearch() {
    this.destSearchQuery = '';
    this.newMission.destinationName = '';
    this.newMission.destinationSiteId = '';
    this.destSuggestions = [];
  }

  setPickingMode(mode: 'ORIGIN' | 'DEST') {
    this.activePickingMode = mode;
  }

  private initMissionMap(): void {
    const container = document.getElementById('mission-route-map');
    if (!container) return;

    if (this.missionMap) {
      this.missionMap.remove();
    }

    this.missionMap = L.map('mission-route-map', {
      zoomControl: true
    }).setView([this.originCoords.lat, this.originCoords.lng], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19
    }).addTo(this.missionMap);

    // Icône Départ (Vert)
    const originIcon = L.divIcon({
      className: 'picker-pin-wrapper',
      html: `
        <div style="background: #10b981; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
          <span class="material-symbols-outlined" style="font-size: 18px;">radio_button_checked</span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    // Icône Arrivée (Orange)
    const destIcon = L.divIcon({
      className: 'picker-pin-wrapper',
      html: `
        <div style="background: #ea4c0e; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid white;">
          <span class="material-symbols-outlined" style="font-size: 18px;">flag</span>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30]
    });

    this.originMarker = L.marker([this.originCoords.lat, this.originCoords.lng], { icon: originIcon, draggable: true }).addTo(this.missionMap);
    this.destMarker = L.marker([this.destCoords.lat, this.destCoords.lng], { icon: destIcon, draggable: true }).addTo(this.missionMap);

    this.originMarker.bindTooltip('Départ (Déplacement possible)', { direction: 'top' });
    this.destMarker.bindTooltip('Destination (Déplacement possible)', { direction: 'top' });

    // Clic sur la carte : assigne soit l'origine soit la destination selon le mode actif
    this.missionMap.on('click', (e: L.LeafletMouseEvent) => {
      this.handleMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Glisser le pin départ
    this.originMarker.on('dragend', () => {
      const pos = this.originMarker?.getLatLng();
      if (pos) {
        this.originCoords = { lat: pos.lat, lng: pos.lng };
        this.reverseGeocodePoint(pos.lat, pos.lng, 'ORIGIN');
        this.updateMapRoute();
      }
    });

    // Glisser le pin arrivée
    this.destMarker.on('dragend', () => {
      const pos = this.destMarker?.getLatLng();
      if (pos) {
        this.destCoords = { lat: pos.lat, lng: pos.lng };
        this.reverseGeocodePoint(pos.lat, pos.lng, 'DEST');
        this.updateMapRoute();
      }
    });

    this.updateMapRoute();

    setTimeout(() => {
      this.missionMap?.invalidateSize();
    }, 250);
  }

  private handleMapClick(lat: number, lng: number): void {
    if (this.activePickingMode === 'ORIGIN') {
      this.originCoords = { lat, lng };
      this.originMarker?.setLatLng([lat, lng]);
      this.reverseGeocodePoint(lat, lng, 'ORIGIN');
    } else {
      this.destCoords = { lat, lng };
      this.destMarker?.setLatLng([lat, lng]);
      this.reverseGeocodePoint(lat, lng, 'DEST');
    }
    this.updateMapRoute();
  }

  private reverseGeocodePoint(lat: number, lng: number, target: 'ORIGIN' | 'DEST'): void {
    this.isGeocodingLoading = true;
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.isGeocodingLoading = false;
        if (data && data.display_name) {
          const road = data.address?.road || data.address?.suburb || data.address?.city || data.display_name;
          if (target === 'ORIGIN') {
            this.newMission.originName = road;
            this.newMission.originSiteId = '';
          } else {
            this.newMission.destinationName = road;
            this.newMission.destinationSiteId = '';
          }
        }
      })
      .catch(() => {
        this.isGeocodingLoading = false;
      });
  }

  private updateMapRoute(): void {
    if (!this.missionMap) return;

    if (this.originMarker) {
      this.originMarker.setLatLng([this.originCoords.lat, this.originCoords.lng]);
    }
    if (this.destMarker) {
      this.destMarker.setLatLng([this.destCoords.lat, this.destCoords.lng]);
    }

    if (this.routeLine) {
      this.missionMap.removeLayer(this.routeLine);
      this.routeLine = undefined;
    }

    const coords: [number, number][] = [
      [this.originCoords.lat, this.originCoords.lng],
      [this.destCoords.lat, this.destCoords.lng]
    ];

    this.routeLine = L.polyline(coords, {
      color: '#3b82f6',
      weight: 3,
      dashArray: '6, 6',
      opacity: 0.9
    }).addTo(this.missionMap);

    // Calcul automatique de la distance
    this.newMission.distanceKm = this.calculateDistance(
      this.originCoords.lat,
      this.originCoords.lng,
      this.destCoords.lat,
      this.destCoords.lng
    );

    // Recadrer la carte
    this.missionMap.fitBounds(this.routeLine.getBounds(), { padding: [40, 40], maxZoom: 14 });
  }

  startMission(mission: Mission): void {
    this.mockService.acceptDeparture(mission.id);
    this.toast.success(`Mission ${mission.code} démarrée avec succès. Surveillance télématique active.`);
  }

  finishMission(mission: Mission): void {
    this.mockService.validateAndCloseMission(mission.id);
    this.toast.success(`Mission ${mission.code} terminée. Le tracé actif a été balayé de la carte.`);
  }

  openNewMissionModal() {
    const inOneHour = new Date(Date.now() + 3600 * 1000);
    const dateFormatted = inOneHour.toISOString().slice(0, 16);

    this.newMission = {
      title: '',
      vehicleId: '',
      driverId: '',
      originSiteId: '',
      originName: 'Dépôt Central Hann Bel-Air',
      destinationSiteId: '',
      destinationName: 'Plateforme Industrielle Diamniadio',
      distanceKm: 0,
      plannedStartTime: dateFormatted,
      notes: ''
    };
    this.originSearchQuery = 'Dépôt Central Hann Bel-Air';
    this.destSearchQuery = 'Plateforme Industrielle Diamniadio';
    this.originSuggestions = [];
    this.destSuggestions = [];
    this.originCoords = { lat: 14.7167, lng: -17.4677 };
    this.destCoords = { lat: 14.7410, lng: -17.3240 };
    this.activePickingMode = 'ORIGIN';
    this.isModalOpen = true;

    setTimeout(() => {
      this.initMissionMap();
    }, 200);
  }

  closeModal() {
    this.isModalOpen = false;
    if (this.missionMap) {
      this.missionMap.remove();
      this.missionMap = undefined;
      this.originMarker = undefined;
      this.destMarker = undefined;
      this.routeLine = undefined;
    }
  }

  saveMission() {
    if (!this.newMission.title || !this.newMission.vehicleId || !this.newMission.driverId) {
      this.toast.error('Veuillez renseigner le titre de la mission, sélectionner un véhicule et un chauffeur.');
      return;
    }

    if (!this.newMission.originName || !this.newMission.destinationName) {
      this.toast.error('Veuillez renseigner le point d\'origine et la destination de la tournée.');
      return;
    }

    const created = this.mockService.addMission({
      title: this.newMission.title,
      vehicleId: this.newMission.vehicleId,
      driverId: this.newMission.driverId,
      originName: this.newMission.originName,
      destinationName: this.newMission.destinationName,
      originSiteId: this.newMission.originSiteId || undefined,
      destinationSiteId: this.newMission.destinationSiteId || undefined,
      distanceKm: this.newMission.distanceKm,
      plannedStartTime: this.newMission.plannedStartTime ? new Date(this.newMission.plannedStartTime).toISOString() : undefined,
      notes: this.newMission.notes
    });

    this.toast.success(`Tournée ${created.code} créée et surveillée par télématique.`);
    this.isModalOpen = false;
  }
}
