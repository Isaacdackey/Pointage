import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Vehicle, Driver, Tracker, Mission, Alert, GpsPosition, TripEvent, MaintenanceRecord, VehicleType, GeoSite, SiteVisitLog, ScheduledDeadline, ScheduledDeadlineType } from '../models/fleet.models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private notificationService = inject(NotificationService);
  private vehicles$ = new BehaviorSubject<Vehicle[]>([
    {
      id: 'v1',
      registrationNumber: 'DK-4920-BA',
      make: 'Toyota',
      model: 'Hilux Double Cabine',
      type: 'PICKUP',
      status: 'EN_MISSION',
      currentTrackerId: 'tr-001',
      assignedDriverId: 'd1',
      assignedDriverName: 'Mamadou Diallo',
      assignedDriverPhone: '+221 77 123 45 67',
      odometerKm: 84320,
      technicalInspectionExpiry: '2027-04-15',
      insuranceExpiry: '2027-02-28',
      registrationCardNumber: 'CG-SN-2024-8842',
      canCutEngineRemotely: true,
      lastPosition: {
        vehicleId: 'v1',
        trackerId: 'tr-001',
        latitude: 14.7167,
        longitude: -17.4677,
        eventTime: new Date(Date.now() - 30 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 25 * 1000).toISOString(),
        speedKph: 54,
        heading: 180,
        ignition: true,
        freshnessSeconds: 30
      }
    },
    {
      id: 'v2',
      registrationNumber: 'DK-8112-BB',
      make: 'Renault',
      model: 'Master Furgon L3H2',
      type: 'FOURGONNETTE',
      status: 'EN_MISSION',
      currentTrackerId: 'tr-002',
      assignedDriverId: 'd2',
      assignedDriverName: 'Abdoulaye Ndiaye',
      assignedDriverPhone: '+221 78 456 78 90',
      odometerKm: 142100,
      technicalInspectionExpiry: '2026-12-10',
      insuranceExpiry: '2026-11-30',
      registrationCardNumber: 'CG-SN-2023-4102',
      canCutEngineRemotely: true,
      lastPosition: {
        vehicleId: 'v2',
        trackerId: 'tr-002',
        latitude: 14.7392,
        longitude: -17.4520,
        eventTime: new Date(Date.now() - 85 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 80 * 1000).toISOString(),
        speedKph: 68,
        heading: 95,
        ignition: true,
        freshnessSeconds: 85
      }
    },
    {
      id: 'v3',
      registrationNumber: 'TH-3310-A',
      make: 'Mercedes-Benz',
      model: 'Actros 1845 Tracteur',
      type: 'CAMION',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-003',
      assignedDriverId: 'd3',
      assignedDriverName: 'Ousmane Sow',
      assignedDriverPhone: '+221 70 889 01 23',
      odometerKm: 210500,
      technicalInspectionExpiry: '2027-01-20',
      insuranceExpiry: '2027-03-31',
      registrationCardNumber: 'CG-SN-2022-9901',
      canCutEngineRemotely: true,
      lastPosition: {
        vehicleId: 'v3',
        trackerId: 'tr-003',
        latitude: 14.7930,
        longitude: -16.9260,
        eventTime: new Date(Date.now() - 240 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 230 * 1000).toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 240
      }
    },
    {
      id: 'v4',
      registrationNumber: 'DK-1092-BC',
      make: 'Peugeot',
      model: 'Partner Van',
      type: 'FOURGONNETTE',
      status: 'MAINTENANCE',
      currentTrackerId: 'tr-004',
      odometerKm: 65400,
      technicalInspectionExpiry: '2026-10-30',
      insuranceExpiry: '2026-11-15',
      registrationCardNumber: 'CG-SN-2024-1189',
      canCutEngineRemotely: false,
      lastPosition: {
        vehicleId: 'v4',
        trackerId: 'tr-004',
        latitude: 14.6928,
        longitude: -17.4467,
        eventTime: new Date(Date.now() - 7200 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 7190 * 1000).toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 7200
      }
    },
    {
      id: 'v5',
      registrationNumber: 'DK-5521-BD',
      make: 'Yamaha',
      model: 'Crux 110 Express',
      type: 'MOTO',
      status: 'EN_MISSION',
      currentTrackerId: 'tr-005',
      assignedDriverId: 'd4',
      assignedDriverName: 'Cheikh Fall',
      assignedDriverPhone: '+221 77 654 32 10',
      odometerKm: 28400,
      technicalInspectionExpiry: '2027-06-15',
      insuranceExpiry: '2027-05-31',
      registrationCardNumber: 'CG-SN-2025-0145',
      canCutEngineRemotely: false,
      lastPosition: {
        vehicleId: 'v5',
        trackerId: 'tr-005',
        latitude: 14.6850,
        longitude: -17.4580,
        eventTime: new Date(Date.now() - 15 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 12 * 1000).toISOString(),
        speedKph: 42,
        heading: 210,
        ignition: true,
        freshnessSeconds: 15
      }
    },
    {
      id: 'v6',
      registrationNumber: 'DK-7789-BE',
      make: 'Honda',
      model: 'Activa 125',
      type: 'SCOOTER',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-001',
      odometerKm: 15200,
      technicalInspectionExpiry: '2027-07-20',
      insuranceExpiry: '2027-06-30',
      registrationCardNumber: 'CG-SN-2025-0891',
      canCutEngineRemotely: false,
      lastPosition: {
        vehicleId: 'v6',
        trackerId: 'tr-001',
        latitude: 14.7100,
        longitude: -17.4600,
        eventTime: new Date(Date.now() - 600 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 590 * 1000).toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 600
      }
    },
    {
      id: 'v7',
      registrationNumber: 'DK-9012-BF',
      make: 'Bajaj',
      model: 'Maxima Cargo',
      type: 'TRICYCLE',
      status: 'EN_MISSION',
      currentTrackerId: 'tr-002',
      odometerKm: 34100,
      technicalInspectionExpiry: '2026-11-25',
      insuranceExpiry: '2026-12-31',
      registrationCardNumber: 'CG-SN-2024-5541',
      canCutEngineRemotely: false,
      lastPosition: {
        vehicleId: 'v7',
        trackerId: 'tr-002',
        latitude: 14.7250,
        longitude: -17.4410,
        eventTime: new Date(Date.now() - 45 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 40 * 1000).toISOString(),
        speedKph: 35,
        heading: 110,
        ignition: true,
        freshnessSeconds: 45
      }
    },
    {
      id: 'v8',
      registrationNumber: 'SL-6654-B',
      make: 'Isuzu',
      model: 'D-Max 4x4',
      type: 'PICKUP',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-003',
      odometerKm: 119800,
      technicalInspectionExpiry: '2027-02-18',
      insuranceExpiry: '2027-01-31',
      registrationCardNumber: 'CG-SN-2023-8874',
      canCutEngineRemotely: true,
      lastPosition: {
        vehicleId: 'v8',
        trackerId: 'tr-003',
        latitude: 14.7500,
        longitude: -17.3800,
        eventTime: new Date(Date.now() - 14400 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 14390 * 1000).toISOString(),
        speedKph: 0,
        heading: 45,
        ignition: false,
        freshnessSeconds: 14400
      }
    },
    {
      id: 'v9',
      registrationNumber: 'DK-3344-BG',
      make: 'Hyundai',
      model: 'HD72 Benne',
      type: 'CAMION',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-004',
      odometerKm: 185000,
      technicalInspectionExpiry: '2027-03-12',
      insuranceExpiry: '2027-04-15',
      registrationCardNumber: 'CG-SN-2022-7712',
      canCutEngineRemotely: true,
      lastPosition: {
        vehicleId: 'v9',
        trackerId: 'tr-004',
        latitude: 14.7800,
        longitude: -17.3200,
        eventTime: new Date(Date.now() - 3600 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 3590 * 1000).toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 3600
      }
    },
    {
      id: 'v10',
      registrationNumber: 'DK-2211-BH',
      make: 'Toyota',
      model: 'Corolla Berline',
      type: 'BERLINE',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-005',
      odometerKm: 52000,
      technicalInspectionExpiry: '2027-08-30',
      insuranceExpiry: '2027-09-15',
      registrationCardNumber: 'CG-SN-2025-1102',
      canCutEngineRemotely: true,
      lastPosition: {
        vehicleId: 'v10',
        trackerId: 'tr-005',
        latitude: 14.7000,
        longitude: -17.4700,
        eventTime: new Date(Date.now() - 1800 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 1790 * 1000).toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 1800
      }
    },
    {
      id: 'v11',
      registrationNumber: 'DK-9900-BJ',
      make: 'Piaggio',
      model: 'Ape Xtra LDX',
      type: 'TRICYCLE',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-001',
      odometerKm: 19800,
      technicalInspectionExpiry: '2027-05-10',
      insuranceExpiry: '2027-04-30',
      registrationCardNumber: 'CG-SN-2025-2231',
      canCutEngineRemotely: false,
      lastPosition: {
        vehicleId: 'v11',
        trackerId: 'tr-001',
        latitude: 14.7300,
        longitude: -17.4300,
        eventTime: new Date(Date.now() - 900 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 890 * 1000).toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 900
      }
    }
  ]);

  private drivers$ = new BehaviorSubject<Driver[]>([
    { id: 'd1', fullName: 'Mamadou Diallo', licenseNumber: 'PERMIS-B-99824', phone: '+221 77 123 45 67', status: 'ACTIF', assignedVehicleId: 'v1', rating: 4.9, completedMissions: 142 },
    { id: 'd2', fullName: 'Abdoulaye Ndiaye', licenseNumber: 'PERMIS-C-44211', phone: '+221 78 456 78 90', status: 'ACTIF', assignedVehicleId: 'v2', rating: 4.8, completedMissions: 98 },
    { id: 'd3', fullName: 'Ousmane Sow', licenseNumber: 'PERMIS-EC-1092', phone: '+221 70 889 01 23', status: 'ACTIF', assignedVehicleId: 'v3', rating: 4.7, completedMissions: 215 },
    { id: 'd4', fullName: 'Cheikh Fall', licenseNumber: 'PERMIS-B-77610', phone: '+221 76 332 11 00', status: 'CONGE', assignedVehicleId: 'v5', rating: 4.6, completedMissions: 76 },
    { id: 'd5', fullName: 'Ibrahima Ba', licenseNumber: 'PERMIS-B-55420', phone: '+221 77 900 33 22', status: 'ACTIF', rating: 4.9, completedMissions: 45 }
  ]);

  private trackers$ = new BehaviorSubject<Tracker[]>([
    { id: 'tr-001', identifier: 'IMEI-864902041284910', vendor: 'Teltonika', model: 'FMB920', protocol: 'TCP/Teltonika-v1', status: 'ACTIF', batteryPercent: 96, lastSeenAt: 'Il y a 30 sec', vehicleId: 'v1' },
    { id: 'tr-002', identifier: 'IMEI-864902041284911', vendor: 'Concox', model: 'GV20', protocol: 'TCP/Concox', status: 'ACTIF', batteryPercent: 88, lastSeenAt: 'Il y a 1 min', vehicleId: 'v2' },
    { id: 'tr-003', identifier: 'IMEI-864902041284912', vendor: 'Queclink', model: 'GV300W', protocol: 'UDP/Queclink', status: 'ACTIF', batteryPercent: 99, lastSeenAt: 'Il y a 4 min', vehicleId: 'v3' },
    { id: 'tr-004', identifier: 'IMEI-864902041284913', vendor: 'Teltonika', model: 'FMC130', protocol: 'TCP/Teltonika-v1', status: 'MUET', batteryPercent: 34, lastSeenAt: 'Il y a 2 heures', vehicleId: 'v4' },
    { id: 'tr-005', identifier: 'IMEI-864902041284914', vendor: 'Coban', model: 'TK303G', protocol: 'TCP/Coban', status: 'MUET', batteryPercent: 12, lastSeenAt: 'Il y a 4 heures', vehicleId: 'v5' }
  ]);

  private missions$ = new BehaviorSubject<Mission[]>([
    {
      id: 'm1',
      code: 'MIS-2026-089',
      title: 'Approvisionnement Entrepôt Diamniadio',
      status: 'EN_COURS',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      driverId: 'd1',
      driverName: 'Mamadou Diallo',
      driverPhone: '+221 77 123 45 67',
      originName: 'Port Autonome de Dakar (Quai 4)',
      destinationName: 'Plateforme Industrielle Diamniadio',
      originSiteId: 'site-3',
      destinationSiteId: 'site-4',
      plannedStartTime: new Date(Date.now() - 3600 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      actualStartTime: new Date(Date.now() - 3400 * 1000).toISOString(),
      distanceKm: 42,
      gpsDepartureDetected: true,
      gpsArrivalDetected: false,
      hasDeviation: false,
      delayMinutes: 0,
      isDelayed: false,
      currentProgressPercent: 68,
      lastCheckpointPassed: 'Péage Bargny (14:10)',
      notes: 'Colis prioritaires. Corridor Autoroute à Péage assigné.'
    },
    {
      id: 'm2',
      code: 'MIS-2026-090',
      title: 'Livraison Clients Centre-Ville Plateau',
      status: 'EN_ANOMALIE',
      vehicleId: 'v2',
      vehicleReg: 'DK-8112-BB',
      driverId: 'd2',
      driverName: 'Abdoulaye Ndiaye',
      driverPhone: '+221 78 456 78 90',
      originName: 'Siège GeoFleet & Dépôt Central',
      destinationName: 'Dakar Plateau Commercial',
      originSiteId: 'site-5',
      plannedStartTime: new Date(Date.now() - 5400 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() - 900 * 1000).toISOString(),
      actualStartTime: new Date(Date.now() - 5200 * 1000).toISOString(),
      distanceKm: 18,
      gpsDepartureDetected: true,
      gpsArrivalDetected: false,
      hasDeviation: true,
      deviationDetails: 'Véhicule détecté sur la Corniche Ouest (hors corridor direct).',
      delayMinutes: 35,
      isDelayed: true,
      currentProgressPercent: 40,
      lastCheckpointPassed: 'Rond-Point Poste Médina',
      notes: 'Déviation constatée par la télématique GPS. Alerte générée automatiquement.'
    },
    {
      id: 'm3',
      code: 'MIS-2026-091',
      title: 'Transfert Matériaux Port -> Zone Industrielle',
      status: 'PLANIFIEE',
      vehicleId: 'v3',
      vehicleReg: 'TH-3310-A',
      driverId: 'd3',
      driverName: 'Ousmane Sow',
      driverPhone: '+221 70 889 01 23',
      originName: 'DP World - Terminal à Conteneurs',
      destinationName: 'Plateforme Industrielle Diamniadio',
      originSiteId: 'site-3',
      destinationSiteId: 'site-4',
      plannedStartTime: new Date(Date.now() + 1800 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 16200 * 1000).toISOString(),
      distanceKm: 48,
      gpsDepartureDetected: false,
      gpsArrivalDetected: false,
      hasDeviation: false,
      delayMinutes: 0,
      isDelayed: false,
      currentProgressPercent: 0,
      notes: 'Départ prévu à 18h30 dès déchargement quai.'
    },
    {
      id: 'm4',
      code: 'MIS-2026-088',
      title: 'Transfert Équipements Rufisque',
      status: 'TERMINEE',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      driverId: 'd1',
      driverName: 'Mamadou Diallo',
      driverPhone: '+221 77 123 45 67',
      originName: 'Siège GeoFleet & Dépôt Central',
      destinationName: 'Rufisque Centre',
      originSiteId: 'site-5',
      plannedStartTime: new Date(Date.now() - 86400 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() - 75000 * 1000).toISOString(),
      actualStartTime: new Date(Date.now() - 86000 * 1000).toISOString(),
      actualEndTime: new Date(Date.now() - 74800 * 1000).toISOString(),
      distanceKm: 32,
      gpsDepartureDetected: true,
      gpsArrivalDetected: true,
      hasDeviation: false,
      delayMinutes: 0,
      isDelayed: false,
      currentProgressPercent: 100,
      lastCheckpointPassed: 'Site Destination (Arrêt 45 min)',
      notes: 'Tournée clôturée sans anomalie.'
    }
  ]);

  private alerts$ = new BehaviorSubject<Alert[]>([
    {
      id: 'alt-1',
      type: 'SORTIE_ZONE',
      severity: 'CRITIQUE',
      vehicleId: 'v2',
      vehicleReg: 'DK-8112-BB',
      driverName: 'Abdoulaye Ndiaye',
      missionId: 'm2',
      routeInfo: 'Point E ➔ Almadies (Livraison)',
      detectedLocation: 'Axe Aéroport Léopold Sédar Senghor (Yoff)',
      occurredAt: 'Il y a 6 min',
      status: 'NOUVELLE',
      description: 'DÉVIATION CRITIQUE : Le véhicule devait effectuer la liaison Point E ➔ Almadies mais a été localisé à l\'Aéroport (hors zone et à l\'opposé du corridor autorisé).'
    },
    {
      id: 'alt-2',
      type: 'PERTE_SIGNAL',
      severity: 'CRITIQUE',
      vehicleId: 'v4',
      vehicleReg: 'DK-1092-BC',
      driverName: 'Ibrahima Ba',
      detectedLocation: 'Dernière trame : Grand Yoff (Immobile)',
      occurredAt: 'Il y a 2 h 15',
      status: 'PRISE_EN_CHARGE',
      assignedTo: 'Superviseur Logistique (Amadou)',
      actionType: 'Appel Chauffeur',
      description: 'PERTE DE SIGNAL GPS : Aucune trame reçue depuis 135 minutes (seuil d\'alerte : 15 min). Traceur potentiellement déconnecté ou zone blanche prolongée.'
    },
    {
      id: 'alt-3',
      type: 'EXCES_VITESSE',
      severity: 'MAJEURE',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      driverName: 'Mamadou Diallo',
      missionId: 'm1',
      routeInfo: 'Dépôt Hann Bel-Air ➔ Diamniadio',
      detectedLocation: 'Autoroute à Péage (Tronçon Rufisque Est)',
      currentSpeedKph: 108,
      maxSpeedAllowed: 80,
      occurredAt: 'Il y a 14 min',
      status: 'NOUVELLE',
      description: 'EXCÈS DE VITESSE : Vitesse instantanée de 108 km/h transmise par le traceur GPS (vitesse maximale autorisée pour ce type de véhicule : 80 km/h).'
    },
    {
      id: 'alt-4',
      type: 'RETARD',
      severity: 'MINEURE',
      vehicleId: 'v6',
      vehicleReg: 'DK-7788-BE',
      driverName: 'Ousmane Sow',
      missionId: 'm3',
      routeInfo: 'Port Autonome ➔ Entrepôt Thiaroye',
      detectedLocation: 'Embouteillage Route de Rufisque',
      occurredAt: 'Il y a 25 min',
      status: 'NOUVELLE',
      description: 'RETARD DE LIVRAISON : Pointage destination dépassé de +30 min par rapport à l\'ETA estimé en raison de ralentissements signalés.'
    }
  ]);

  private tripEvents$ = new BehaviorSubject<TripEvent[]>([
    {
      id: 'evt-1',
      missionId: 'm1',
      vehicleId: 'v1',
      driverId: 'd1',
      type: 'DEPART',
      declaredTime: new Date(Date.now() - 3400 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      receivedTime: new Date(Date.now() - 3398 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latitude: 14.693,
      longitude: -17.432,
      synced: true,
      comment: 'Départ validé avec réservoir plein.'
    }
  ]);

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicles$.asObservable();
  }

  getVehiclesDirect(): Vehicle[] {
    return this.vehicles$.getValue();
  }

  addDriver(driver: {
    fullName: string;
    licenseNumber: string;
    phone: string;
    status?: 'ACTIF' | 'CONGE' | 'SUSPENDU';
    assignedVehicleId?: string;
  }): Driver {
    const newDriver: Driver = {
      id: 'd-' + Date.now(),
      fullName: driver.fullName.trim(),
      licenseNumber: (driver.licenseNumber || '').trim().toUpperCase(),
      phone: (driver.phone || '').trim(),
      status: driver.status || 'ACTIF',
      assignedVehicleId: driver.assignedVehicleId || undefined,
      rating: 5.0,
      completedMissions: 0
    };
    const current = this.drivers$.getValue();
    this.drivers$.next([...current, newDriver]);
    this.notificationService.sendPushNotification({
      title: 'Nouveau Chauffeur Enregistré',
      body: `${newDriver.fullName} (${newDriver.licenseNumber}) ajouté à la flotte.`
    });
    return newDriver;
  }

  addTracker(tracker: {
    identifier: string;
    vendor: string;
    model: string;
    protocol?: string;
    status?: any;
    batteryPercent?: number;
    vehicleId?: string;
  }): Tracker {
    const newTracker: Tracker = {
      id: 'tr-' + Date.now(),
      identifier: tracker.identifier.trim().toUpperCase(),
      vendor: (tracker.vendor || 'Teltonika').trim(),
      model: (tracker.model || 'FMB920').trim(),
      protocol: (tracker.protocol || 'TCP/Teltonika-v1').trim(),
      status: tracker.status || 'ACTIF',
      batteryPercent: tracker.batteryPercent ?? 100,
      lastSeenAt: 'À l\'instant',
      vehicleId: tracker.vehicleId || undefined
    };
    const current = this.trackers$.getValue();
    this.trackers$.next([...current, newTracker]);
    this.notificationService.sendPushNotification({
      title: 'Nouveau Boîtier Traceur Enregistré',
      body: `Boîtier ${newTracker.identifier} (${newTracker.vendor} ${newTracker.model}) ajouté au parc.`
    });
    return newTracker;
  }

  getDrivers(): Observable<Driver[]> {
    return this.drivers$.asObservable();
  }

  getTrackers(): Observable<Tracker[]> {
    return this.trackers$.asObservable();
  }

  getMissions(): Observable<Mission[]> {
    return this.missions$.asObservable();
  }

  getAlerts(): Observable<Alert[]> {
    return this.alerts$.asObservable();
  }

  addVehicle(newVehicle: {
    registrationNumber: string;
    make: string;
    model: string;
    type: VehicleType;
    odometerKm?: number;
    assignedDriverId?: string;
    currentTrackerId?: string;
    technicalInspectionExpiry?: string;
    insuranceExpiry?: string;
    registrationCardNumber?: string;
    canCutEngineRemotely?: boolean;
  }): Vehicle {
    const drivers = this.drivers$.getValue();
    const assignedDriver = drivers.find(d => d.id === newVehicle.assignedDriverId);

    const id = 'v-' + Date.now();
    const trackerId = newVehicle.currentTrackerId || 'tr-001';

    const vehicle: Vehicle = {
      id,
      registrationNumber: (newVehicle.registrationNumber || '').trim().toUpperCase(),
      make: (newVehicle.make || '').trim(),
      model: (newVehicle.model || '').trim(),
      type: newVehicle.type || 'FOURGONNETTE',
      status: 'DISPONIBLE',
      currentTrackerId: trackerId,
      assignedDriverId: newVehicle.assignedDriverId,
      assignedDriverName: assignedDriver?.fullName,
      assignedDriverPhone: assignedDriver?.phone,
      odometerKm: newVehicle.odometerKm || 0,
      technicalInspectionExpiry: newVehicle.technicalInspectionExpiry,
      insuranceExpiry: newVehicle.insuranceExpiry,
      registrationCardNumber: newVehicle.registrationCardNumber,
      canCutEngineRemotely: newVehicle.canCutEngineRemotely ?? false,
      lastPosition: {
        vehicleId: id,
        trackerId: trackerId,
        latitude: 14.7167 + (Math.random() - 0.5) * 0.05,
        longitude: -17.4677 + (Math.random() - 0.5) * 0.05,
        eventTime: new Date().toISOString(),
        receivedAt: new Date().toISOString(),
        speedKph: 0,
        heading: 0,
        ignition: false,
        freshnessSeconds: 15
      }
    };

    const currentVehicles = this.vehicles$.getValue();
    this.vehicles$.next([vehicle, ...currentVehicles]);

    this.notificationService.sendPushNotification({
      title: 'Nouveau Véhicule Enregistré',
      body: `Le véhicule ${vehicle.registrationNumber} (${vehicle.make} ${vehicle.model}) a été ajouté à la flotte.`
    });

    return vehicle;
  }

  addMission(newMission: {
    title: string;
    vehicleId: string;
    driverId: string;
    originName: string;
    destinationName: string;
    originSiteId?: string;
    destinationSiteId?: string;
    distanceKm?: number;
    plannedStartTime?: string;
    notes?: string;
  }): Mission {
    const vehicles = this.vehicles$.getValue();
    const drivers = this.drivers$.getValue();
    const vehicle = vehicles.find(v => v.id === newMission.vehicleId);
    const driver = drivers.find(d => d.id === newMission.driverId);

    const code = 'MIS-2026-' + Math.floor(100 + Math.random() * 900);
    const mission: Mission = {
      id: 'm-' + Date.now(),
      code: code,
      title: newMission.title,
      status: 'PLANIFIEE',
      vehicleId: newMission.vehicleId,
      vehicleReg: vehicle?.registrationNumber || 'DK-0000-XX',
      driverId: newMission.driverId,
      driverName: driver?.fullName || 'Chauffeur Non Assigné',
      originName: newMission.originName || 'Dakar Centre',
      destinationName: newMission.destinationName || 'Diamniadio',
      originSiteId: newMission.originSiteId,
      destinationSiteId: newMission.destinationSiteId,
      distanceKm: newMission.distanceKm || 35,
      plannedStartTime: newMission.plannedStartTime || new Date().toISOString(),
      plannedEndTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      gpsDepartureDetected: false,
      gpsArrivalDetected: false,
      hasDeviation: false,
      delayMinutes: 0,
      isDelayed: false,
      currentProgressPercent: 0,
      notes: newMission.notes
    };

    const currentMissions = this.missions$.getValue();
    this.missions$.next([mission, ...currentMissions]);

    this.notificationService.sendPushNotification({
      title: 'Nouvelle Tournée / Mission Planifiée',
      body: `${mission.code} assignée à ${mission.driverName} (${mission.vehicleReg}). Trajet surveillé par télématique.`
    });

    return mission;
  }

  getTripEvents(): Observable<TripEvent[]> {
    return this.tripEvents$.asObservable();
  }

  
  declareDeparture(missionId: string, comment?: string): Observable<TripEvent> {
    return this.declareDriverEvent('DEPART', missionId, comment);
  }

  
  acceptDeparture(missionId: string): void {
    const missions = this.missions$.getValue();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    mission.status = 'EN_COURS';
    mission.departureValidatedByAgent = true;
    mission.actualStartTime = new Date().toISOString();


    const vehicles = this.vehicles$.getValue();
    const v = vehicles.find(veh => veh.id === mission.vehicleId);
    if (v) {
      v.status = 'EN_MISSION';
      this.vehicles$.next([...vehicles]);
    }

    this.missions$.next([...missions]);

    this.notificationService.sendPushNotification({
      title: 'Départ Accepté & Validé',
      body: `Mission ${mission.code} (${mission.vehicleReg}) officiellement démarrée. Suivi télématique actif.`
    });
  }

  
  declareArrival(missionId: string, comment?: string): Observable<TripEvent> {
    return this.declareDriverEvent('ARRIVEE', missionId, comment);
  }

  
  validateAndCloseMission(missionId: string): void {
    const missions = this.missions$.getValue();
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    mission.status = 'TERMINEE';
    mission.arrivalValidatedByAgent = true;
    mission.actualEndTime = new Date().toISOString();

    const vehicles = this.vehicles$.getValue();
    const v = vehicles.find(veh => veh.id === mission.vehicleId);
    if (v) {
      v.status = 'DISPONIBLE';
      this.vehicles$.next([...vehicles]);
    }

    this.missions$.next([...missions]);

    this.notificationService.sendPushNotification({
      title: 'Mission Validée & Clôturée',
      body: `Mission ${mission.code} certifiée par le régulateur. Véhicule ${mission.vehicleReg} remis à disposition.`
    });
  }
 
  declareDriverEvent(type: 'DEPART' | 'PAUSE' | 'REPRISE' | 'ARRIVEE' | 'INCIDENT', missionId: string, comment?: string): Observable<TripEvent> {
    const missions = this.missions$.getValue();
    const targetMission = missions.find(m => m.id === missionId);

    const newEvent: TripEvent = {
      id: 'evt-' + Math.random().toString(36).substr(2, 9),
      missionId: missionId,
      vehicleId: targetMission?.vehicleId || 'v1',
      driverId: targetMission?.driverId || 'd1',
      type: type,
      declaredTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      receivedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latitude: 14.7167,
      longitude: -17.4677,
      synced: true,
      comment: comment || `Action chauffeur : ${type}`
    };

    const current = this.tripEvents$.getValue();
    this.tripEvents$.next([newEvent, ...current]);

    if (targetMission) {
      if (type === 'DEPART') {
        targetMission.status = 'DEMANDE_DEMARRAGE';
        targetMission.departureDeclared = true;
        targetMission.departureRequestedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.notificationService.sendPushNotification({
          title: 'Demande de Départ Chauffeur',
          body: `${targetMission.driverName} déclare le départ pour la mission ${targetMission.code}. En attente d\'acceptation.`
        });
      } else if (type === 'ARRIVEE') {
        targetMission.status = 'ATTENTE_VALIDATION';
        targetMission.arrivalDeclared = true;
        targetMission.arrivalRequestedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.notificationService.sendPushNotification({
          title: 'Déclaration d\'Arrivée Chauffeur',
          body: `${targetMission.driverName} a atteint la destination (${targetMission.destinationName}). En attente de validation clôture.`
        });
      } else if (type === 'PAUSE') {
        targetMission.status = 'EN_PAUSE';
        this.notificationService.sendPushNotification({
          title: 'Pause Véhicule',
          body: `${targetMission.driverName} (${targetMission.vehicleReg}) s\'est mis en pause temporaire.`
        });
      } else if (type === 'REPRISE') {
        targetMission.status = 'EN_COURS';
        this.notificationService.sendPushNotification({
          title: 'Reprise de Route',
          body: `${targetMission.driverName} (${targetMission.vehicleReg}) a repris la route.`
        });
      } else if (type === 'INCIDENT') {
        targetMission.status = 'EN_ANOMALIE';
        
        const newAlert: Alert = {
          id: 'alt-' + Date.now(),
          type: 'INCIDENT_CHAUFFEUR',
          severity: 'CRITIQUE',
          vehicleId: targetMission.vehicleId,
          vehicleReg: targetMission.vehicleReg,
          driverName: targetMission.driverName,
          missionId: targetMission.id,
          occurredAt: 'À l\'instant',
          status: 'NOUVELLE',
          description: comment || 'Incident signalé par le chauffeur sur le terrain'
        };
        const currentAlerts = this.alerts$.getValue();
        this.alerts$.next([newAlert, ...currentAlerts]);

        this.notificationService.sendPushNotification({
          title: 'Alerte Incident Chauffeur',
          body: `${targetMission.vehicleReg} : ${comment || 'Incident signalé'}`
        });
      }
      this.missions$.next([...missions]);
    }

    return of(newEvent);
  }

  
  updateAlertStatus(
    alertId: string,
    newStatus: 'PRISE_EN_CHARGE' | 'CLOTUREE' | 'IGNOREE',
    details?: { assignedTo?: string; actionType?: string; resolutionNote?: string }
  ) {
    const alerts = this.alerts$.getValue();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = newStatus;
      if (details) {
        if (details.assignedTo) alert.assignedTo = details.assignedTo;
        if (details.actionType) alert.actionType = details.actionType;
        if (details.resolutionNote) alert.resolutionNote = details.resolutionNote;
        alert.handledAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }

      this.alerts$.next([...alerts]);
      if (newStatus === 'CLOTUREE') {
        this.notificationService.sendPushNotification({
          title: 'Alerte clôturée',
          body: `L'anomalie sur le véhicule ${alert.vehicleReg} a été résolue.`
        });
      } else if (newStatus === 'PRISE_EN_CHARGE') {
        this.notificationService.sendPushNotification({
          title: 'Alerte prise en charge',
          body: `Anomalie ${alert.vehicleReg} prise en charge par ${alert.assignedTo || 'l\'opérateur'}.`
        });
      }
    }
  }

  // Carnet d'Entretien / Maintenance
  private maintenanceRecords$ = new BehaviorSubject<MaintenanceRecord[]>([
    {
      id: 'maint-1',
      vehicleId: 'v4',
      vehicleReg: 'DK-1092-BC',
      type: 'REPARATION',
      title: 'Remplacement kit embrayage & révision freinage',
      description: 'Changement disque d\'embrayage et plaquettes de frein avant suite usure prononcée.',
      serviceDate: '2026-10-22',
      costCfa: 185000,
      provider: 'Garage Central Dakar',
      odometerKm: 65400,
      status: 'EN_COURS',
      performedBy: 'Mamadou Ba (Mécanicien Référent)'
    },
    {
      id: 'maint-2',
      vehicleId: 'v2',
      vehicleReg: 'DK-8112-BB',
      type: 'VIDANGE',
      title: 'Vidange complète 140 000 km + Filtres',
      description: 'Huile moteur 5W30 synthèse, filtre à huile, filtre à gazole et filtre d\'habitacle.',
      serviceDate: '2026-10-14',
      costCfa: 72000,
      provider: 'Total Lubrifiants Hann',
      odometerKm: 140200,
      status: 'TERMINEE',
      performedBy: 'Samba Kane (Exploitation)',
      nextDueOdometerKm: 150000,
      nextDueDate: '2027-01-15'
    },
    {
      id: 'maint-3',
      vehicleId: 'v3',
      vehicleReg: 'TH-3310-A',
      type: 'VISITE_TECHNIQUE',
      title: 'Visite Technique Poids Lourd Annuelle',
      description: 'Contrôle périodique obligatoire réussi sans contre-visite. Vignette validée.',
      serviceDate: '2026-09-28',
      costCfa: 45000,
      provider: 'Centre Contrôle Technique Automobile (CCTA)',
      odometerKm: 208000,
      status: 'TERMINEE',
      nextDueDate: '2027-09-28'
    },
    {
      id: 'maint-4',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      type: 'PNEUMATIQUE',
      title: 'Remplacement 2 pneus arrière tout-terrain',
      description: 'Montage pneus Bridgestone Dueler A/T avec équilibrage train arrière.',
      serviceDate: '2026-09-15',
      costCfa: 160000,
      provider: 'Sénégal Pneus Diamniadio',
      odometerKm: 81200,
      status: 'TERMINEE'
    }
  ]);

  
  // Échéances programmables (Directives Mentor 30 Octobre : Assurance, Visite Technique, Vidange avec délai de rappel)
  private deadlines$ = new BehaviorSubject<ScheduledDeadline[]>([
    {
      id: 'dl-1',
      vehicleId: 'v4',
      vehicleReg: 'DK-1092-BC',
      type: 'VISITE_TECHNIQUE',
      title: 'Contrôle Technique Périodique SGS',
      dueDate: '2026-10-30',
      reminderLeadDays: 7,
      provider: 'Centre Contrôle Technique Automobile Dakar',
      notes: 'Visite annuelle obligatoire de conformité.',
      status: 'EXPIREE'
    },
    {
      id: 'dl-2',
      vehicleId: 'v7',
      vehicleReg: 'DK-9012-BF',
      type: 'ASSURANCE',
      title: 'Renouvellement Police Flotte AXA',
      dueDate: '2026-11-25',
      reminderLeadDays: 10,
      provider: 'AXA Assurances Sénégal',
      notes: 'Contrat tous risques flotte commerciale.',
      status: 'EN_ALERTE'
    },
    {
      id: 'dl-3',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      type: 'VIDANGE',
      title: 'Vidange moteur 90 000 km & Filtres',
      dueDate: '2026-11-12',
      reminderLeadDays: 5,
      odometerDueKm: 90000,
      provider: 'Total Lubrifiants Hann',
      notes: 'Huile 5W30 synthèse + filtre à gasoil et habitacle.',
      status: 'EN_ALERTE'
    },
    {
      id: 'dl-4',
      vehicleId: 'v2',
      vehicleReg: 'DK-8112-BB',
      type: 'ASSURANCE',
      title: 'Renouvellement Responsabilité Civile & Dommages',
      dueDate: '2026-11-30',
      reminderLeadDays: 7,
      provider: 'Sonam Assurances',
      notes: 'Échéance semestrielle.',
      status: 'A_VENIR'
    },
    {
      id: 'dl-5',
      vehicleId: 'v3',
      vehicleReg: 'TH-3310-A',
      type: 'VISITE_TECHNIQUE',
      title: 'Visite technique semestrielle Poids Lourd',
      dueDate: '2027-01-20',
      reminderLeadDays: 15,
      provider: 'Centre Contrôle Thiès',
      notes: 'Visite réglementaire transport lourd.',
      status: 'A_JOUR'
    }
  ]);

  getDeadlines(): Observable<ScheduledDeadline[]> {
    return this.deadlines$.asObservable();
  }

  getDeadlinesDirect(): ScheduledDeadline[] {
    return this.deadlines$.getValue();
  }

  addDeadline(dl: Omit<ScheduledDeadline, 'id' | 'status'>): ScheduledDeadline {
    const today = new Date().getTime();
    const dueTime = new Date(dl.dueDate).getTime();
    const diffDays = Math.ceil((dueTime - today) / (1000 * 3600 * 24));
    let status: 'A_VENIR' | 'EN_ALERTE' | 'EXPIREE' | 'A_JOUR' = 'A_VENIR';

    if (diffDays < 0) {
      status = 'EXPIREE';
    } else if (diffDays <= dl.reminderLeadDays) {
      status = 'EN_ALERTE';
    } else {
      status = 'A_VENIR';
    }

    const newDl: ScheduledDeadline = {
      ...dl,
      id: 'dl-' + Date.now(),
      status
    };

    const current = this.deadlines$.getValue();
    this.deadlines$.next([newDl, ...current]);
    this.notificationService.sendPushNotification({
      title: 'Échéance Programmée Enregistrée',
      body: `Rappel ${newDl.type} fixé au ${newDl.dueDate} pour ${newDl.vehicleReg} (alerte ${newDl.reminderLeadDays}j avant).`
    });
    return newDl;
  }

  getMaintenanceRecords(): Observable<MaintenanceRecord[]> {
    return this.maintenanceRecords$.asObservable();
  }

  getMaintenanceRecordsDirect(): MaintenanceRecord[] {
    return this.maintenanceRecords$.getValue();
  }

  addMaintenanceRecord(record: Omit<MaintenanceRecord, 'id'>): MaintenanceRecord {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: 'maint-' + Date.now()
    };
    const current = this.maintenanceRecords$.getValue();
    this.maintenanceRecords$.next([newRecord, ...current]);

    this.notificationService.sendPushNotification({
      title: 'Intervention Maintenance Enregistrée',
      body: `${newRecord.title} pour le véhicule ${newRecord.vehicleReg} (${newRecord.costCfa.toLocaleString('fr-FR')} FCFA).`
    });

    return newRecord;
  }

  // Sites Favoris & Géofencing (Total Almadies, DP World, etc.)
  private geoSites$ = new BehaviorSubject<GeoSite[]>([
    {
      id: 'site-1',
      name: 'Total Almadies',
      category: 'STATION_SERVICE',
      address: 'Route des Almadies, en face King Fahd Palace',
      latitude: 14.7450,
      longitude: -17.5180,
      radiusMeters: 20,
      minStopDurationMinutes: 2,
      contactName: 'Abdou Diop (Gérant Station)',
      contactPhone: '+221 33 820 11 22',
      notes: 'Point de ravitaillement conventionné et livraison lubrifiants',
      createdAt: '2026-09-01'
    },
    {
      id: 'site-2',
      name: 'Total Mbao',
      category: 'STATION_SERVICE',
      address: 'Nationale 1, Sortie Forêt de Mbao',
      latitude: 14.7410,
      longitude: -17.3240,
      radiusMeters: 25,
      minStopDurationMinutes: 2,
      contactName: 'Moussa Gueye',
      contactPhone: '+221 33 834 50 00',
      notes: 'Station relai axe Dakar - Rufisque',
      createdAt: '2026-09-05'
    },
    {
      id: 'site-3',
      name: 'DP World - Terminal à Conteneurs',
      category: 'PORT_LOGISTIQUE',
      address: 'Zone Portuaire Nord, Port Autonome de Dakar',
      latitude: 14.6890,
      longitude: -17.4280,
      radiusMeters: 30,
      minStopDurationMinutes: 3,
      contactName: 'Superviseur Quai 4',
      contactPhone: '+221 33 849 70 00',
      notes: 'Accès réservé badges portuaires et camions porte-conteneurs',
      createdAt: '2026-09-10'
    },
    {
      id: 'site-4',
      name: 'Plateforme Industrielle Diamniadio',
      category: 'USINE_CHANTIER',
      address: 'Pôle Urbain Diamniadio, Sortie Autoroute à Péage',
      latitude: 14.7210,
      longitude: -17.1850,
      radiusMeters: 35,
      minStopDurationMinutes: 2,
      contactName: 'Service Réception Entrepôt',
      contactPhone: '+221 33 879 90 90',
      notes: 'Plateforme centrale de déchargement logistique',
      createdAt: '2026-09-12'
    },
    {
      id: 'site-5',
      name: 'Siège GeoFleet & Dépôt Central',
      category: 'SIEGE_ENTREPRISE',
      address: 'Zone Industrielle Hann Bel-Air, Dakar',
      latitude: 14.7167,
      longitude: -17.4677,
      radiusMeters: 40,
      minStopDurationMinutes: 1,
      contactName: 'Poste de Garde Central',
      contactPhone: '+221 33 832 00 00',
      notes: 'Point de départ et retour officiel de l\'ensemble des tournées',
      createdAt: '2026-08-01'
    }
  ]);

  private siteVisits$ = new BehaviorSubject<SiteVisitLog[]>([
    {
      id: 'vis-1',
      siteId: 'site-1',
      siteName: 'Total Almadies',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      driverName: 'Mamadou Diallo',
      enteredAt: 'Aujourd\'hui 09:42',
      exitedAt: 'Aujourd\'hui 09:58',
      durationMinutes: 16,
      wasStopConfirmed: true,
      missionId: 'MIS-2026-089'
    },
    {
      id: 'vis-2',
      siteId: 'site-3',
      siteName: 'DP World - Terminal à Conteneurs',
      vehicleId: 'v3',
      vehicleReg: 'TH-3310-A',
      driverName: 'Ousmane Sow',
      enteredAt: 'Aujourd\'hui 08:15',
      exitedAt: 'Aujourd\'hui 09:05',
      durationMinutes: 50,
      wasStopConfirmed: true,
      missionId: 'MIS-2026-091'
    },
    {
      id: 'vis-3',
      siteId: 'site-2',
      siteName: 'Total Mbao',
      vehicleId: 'v7',
      vehicleReg: 'DK-9012-BF',
      driverName: 'Chauffeur Flotte',
      enteredAt: 'Aujourd\'hui 11:20',
      exitedAt: 'Aujourd\'hui 11:28',
      durationMinutes: 8,
      wasStopConfirmed: true
    },
    {
      id: 'vis-4',
      siteId: 'site-4',
      siteName: 'Plateforme Industrielle Diamniadio',
      vehicleId: 'v2',
      vehicleReg: 'DK-8112-BB',
      driverName: 'Abdoulaye Ndiaye',
      enteredAt: 'Hier 15:30',
      exitedAt: 'Hier 16:45',
      durationMinutes: 75,
      wasStopConfirmed: true,
      missionId: 'MIS-2026-090'
    }
  ]);

  getGeoSites(): Observable<GeoSite[]> {
    return this.geoSites$.asObservable();
  }

  getSiteVisits(): Observable<SiteVisitLog[]> {
    return this.siteVisits$.asObservable();
  }

  addGeoSite(site: Omit<GeoSite, 'id' | 'createdAt'>): GeoSite {
    const newSite: GeoSite = {
      ...site,
      id: 'site-' + Date.now(),
      createdAt: new Date().toISOString().substring(0, 10)
    };
    const current = this.geoSites$.getValue();
    this.geoSites$.next([newSite, ...current]);

    this.notificationService.sendPushNotification({
      title: 'Nouveau Site Favori Enregistré',
      body: `Site ${newSite.name} ajouté avec rayon de géofencing de ${newSite.radiusMeters}m.`
    });

    return newSite;
  }
}
