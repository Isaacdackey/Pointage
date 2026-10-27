export type VehicleStatus = 'DISPONIBLE' | 'EN_MISSION' | 'INDISPONIBLE' | 'MAINTENANCE';
export type TrackerStatus = 'ACTIF' | 'MUET' | 'NON_ASSOCIE' | 'MAINTENANCE';
export type MissionStatus = 'PLANIFIEE' | 'DEMANDE_DEMARRAGE' | 'EN_COURS' | 'EN_PAUSE' | 'ATTENTE_VALIDATION' | 'TERMINEE' | 'EN_ANOMALIE' | 'ANNULEE';
export type AlertSeverity = 'CRITIQUE' | 'MAJEURE' | 'MINEURE' | 'INFO';
export type AlertType = 'SORTIE_ZONE' | 'PERTE_SIGNAL' | 'EXCES_VITESSE' | 'RETARD' | 'DEPART_NON_DECLARE' | 'INCIDENT_CHAUFFEUR';
export type AlertStatus = 'NOUVELLE' | 'PRISE_EN_CHARGE' | 'CLOTUREE' | 'IGNOREE';
export type TripEventType = 'DEPART' | 'PAUSE' | 'REPRISE' | 'ARRIVEE' | 'INCIDENT';

export type VehicleType =
  | 'MOTO'
  | 'SCOOTER'
  | 'TRICYCLE'
  | 'FOURGONNETTE'
  | 'CAMION'
  | 'PICKUP'
  | 'BERLINE';

export type MaintenanceType = 'VIDANGE' | 'VISITE_TECHNIQUE' | 'FREINAGE' | 'PNEUMATIQUE' | 'REPARATION' | 'ACCIDENT' | 'AUTRE';
export type MaintenanceStatus = 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleReg: string;
  type: MaintenanceType;
  title: string;
  description: string;
  serviceDate: string;
  costCfa: number;
  provider: string; // ex: Garage Central, Total Lubrifiants
  odometerKm: number;
  status: MaintenanceStatus;
  performedBy?: string;
  nextDueDate?: string;
  nextDueOdometerKm?: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  type: VehicleType;
  status: VehicleStatus;
  currentTrackerId?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  odometerKm: number;
  lastPosition?: GpsPosition;
  // Documents & Conformité
  technicalInspectionExpiry?: string; // Visite technique
  insuranceExpiry?: string;           // Assurance
  registrationCardNumber?: string;    // Carte grise
  // Commande à distance si supportée par le boîtier traceur
  canCutEngineRemotely?: boolean;
}

export interface Driver {
  id: string;
  fullName: string;
  licenseNumber: string;
  phone: string;
  status: 'ACTIF' | 'CONGE' | 'SUSPENDU';
  assignedVehicleId?: string;
  rating: number;
  completedMissions: number;
}

export interface Tracker {
  id: string;
  identifier: string;
  vendor: string;
  model: string;
  protocol: string;
  status: TrackerStatus;
  batteryPercent: number;
  lastSeenAt: string;
  vehicleId?: string;
}

export interface GpsPosition {
  id?: string;
  vehicleId: string;
  trackerId: string;
  latitude: number;
  longitude: number;
  eventTime: string;
  receivedAt: string;
  speedKph: number;
  heading: number;
  ignition: boolean;
  freshnessSeconds: number;
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  status: MissionStatus;
  vehicleId: string;
  vehicleReg: string;
  driverId: string;
  driverName: string;
  driverPhone?: string;
  originName: string;
  destinationName: string;
  originSiteId?: string;       // Raccordement aux Sites Favoris (Phase 3)
  destinationSiteId?: string;  // Raccordement aux Sites Favoris (Phase 3)
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;    // Déclenché automatiquement par premier mouvement GPS
  actualEndTime?: string;      // Déclenché automatiquement par arrivée dans géofence destination
  distanceKm: number;
  notes?: string;
  
  // Télématique & Surveillance passive temps réel (Mentor audios 1, 2, 3)
  gpsDepartureDetected: boolean;
  gpsArrivalDetected?: boolean;
  hasDeviation: boolean;          // Trajet hors corridor ou destination non conforme
  deviationDetails?: string;
  delayMinutes: number;           // Retard calculé par rapport à l'ETA
  isDelayed: boolean;
  currentProgressPercent: number; // Progression 0 - 100%
  lastCheckpointPassed?: string;

  // Rétrocompatibilité interne éventuelle
  departureDeclared?: boolean;
  arrivalDeclared?: boolean;
  departureValidatedByAgent?: boolean;
  arrivalValidatedByAgent?: boolean;
  departureRequestedAt?: string;
  arrivalRequestedAt?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  vehicleId: string;
  vehicleReg: string;
  driverName?: string;
  missionId?: string;
  routeInfo?: string;          // ex: "Point E -> Almadies"
  detectedLocation?: string;   // ex: "Zone Aéroport Léopold Sédar Senghor (hors trajet)"
  currentSpeedKph?: number;    // ex: 98
  maxSpeedAllowed?: number;    // ex: 80
  occurredAt: string;
  status: AlertStatus;
  description: string;
  assignedTo?: string;
  actionType?: string;
  resolutionNote?: string;
  handledAt?: string;
}

export interface TripEvent {
  id: string;
  missionId: string;
  vehicleId: string;
  driverId: string;
  type: TripEventType;
  declaredTime: string;
  receivedTime: string;
  latitude?: number;
  longitude?: number;
  synced: boolean;
  comment?: string;
}

export type SiteCategory = 'DEPOT' | 'CLIENT' | 'AUTRE' | 'DEPOT_CLIENT' | 'STATION_SERVICE' | 'PORT_LOGISTIQUE' | 'USINE_CHANTIER' | 'SIEGE_ENTREPRISE';

export interface GeoSite {
  id: string;
  name: string;
  category: SiteCategory;
  address: string;
  latitude: number;
  longitude: number;
  radiusMeters: number; // ex: 20m comme préconisé dans l'audio
  minStopDurationMinutes: number; // ex: 2 min pour valider un arrêt réel
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  createdAt: string;
}

export interface SiteVisitLog {
  id: string;
  siteId: string;
  siteName: string;
  vehicleId: string;
  vehicleReg: string;
  driverName?: string;
  enteredAt: string;
  exitedAt?: string;
  durationMinutes: number;
  wasStopConfirmed: boolean; // true si stationné > minStopDurationMinutes
  missionId?: string;
}
