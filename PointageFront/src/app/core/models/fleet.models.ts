export type VehicleStatus = 'DISPONIBLE' | 'EN_MISSION' | 'INDISPONIBLE' | 'MAINTENANCE';
export type TrackerStatus = 'ACTIF' | 'MUET' | 'NON_ASSOCIE' | 'MAINTENANCE';
export type MissionStatus = 'PLANIFIEE' | 'EN_COURS' | 'EN_PAUSE' | 'TERMINEE' | 'EN_ANOMALIE' | 'ANNULEE';
export type AlertSeverity = 'CRITIQUE' | 'MAJEURE' | 'MINEURE' | 'INFO';
export type AlertType = 'SORTIE_ZONE' | 'PERTE_SIGNAL' | 'EXCES_VITESSE' | 'RETARD' | 'DEPART_NON_DECLARE' | 'INCIDENT_CHAUFFEUR';
export type AlertStatus = 'NOUVELLE' | 'PRISE_EN_CHARGE' | 'CLOTUREE' | 'IGNOREE';
export type TripEventType = 'DEPART' | 'PAUSE' | 'REPRISE' | 'ARRIVEE' | 'INCIDENT';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  type: string;
  status: VehicleStatus;
  currentTrackerId?: string;
  assignedDriverId?: string;
  assignedDriverName?: string;
  odometerKm: number;
  fuelLevelPercent: number;
  lastPosition?: GpsPosition;
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
  identifier: string; // IMEI / Serial
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
  eventTime: string; // ISO
  receivedAt: string; // ISO
  speedKph: number;
  heading: number;
  ignition: boolean;
  freshnessSeconds: number; // calculated age
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
  originName: string;
  destinationName: string;
  plannedStartTime: string;
  plannedEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  distanceKm: number;
  notes?: string;
  departureDeclared?: boolean;
  arrivalDeclared?: boolean;
  gpsDepartureDetected?: boolean;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  vehicleId: string;
  vehicleReg: string;
  driverName?: string;
  missionId?: string;
  occurredAt: string;
  status: AlertStatus;
  description: string;
  assignedTo?: string;
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
