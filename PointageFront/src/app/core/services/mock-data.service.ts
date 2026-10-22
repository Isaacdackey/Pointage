import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Vehicle, Driver, Tracker, Mission, Alert, GpsPosition, TripEvent } from '../models/fleet.models';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private vehicles$ = new BehaviorSubject<Vehicle[]>([
    {
      id: 'v1',
      registrationNumber: 'DK-4920-BA',
      make: 'Toyota',
      model: 'Hilux 4x4',
      type: 'Pickup utilitaire',
      status: 'EN_MISSION',
      currentTrackerId: 'tr-001',
      assignedDriverId: 'd1',
      assignedDriverName: 'Mamadou Diallo',
      odometerKm: 84320,
      fuelLevelPercent: 78,
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
      model: 'Master Furgon',
      type: 'Fourgonnette livraison',
      status: 'EN_MISSION',
      currentTrackerId: 'tr-002',
      assignedDriverId: 'd2',
      assignedDriverName: 'Abdoulaye Ndiaye',
      odometerKm: 142100,
      fuelLevelPercent: 42,
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
      model: 'Actros 1845',
      type: 'Poids Lourd',
      status: 'DISPONIBLE',
      currentTrackerId: 'tr-003',
      assignedDriverId: 'd3',
      assignedDriverName: 'Ousmane Sow',
      odometerKm: 210500,
      fuelLevelPercent: 90,
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
      model: 'Partner',
      type: 'Utilitaire léger',
      status: 'MAINTENANCE',
      currentTrackerId: 'tr-004',
      odometerKm: 65400,
      fuelLevelPercent: 25,
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
      registrationNumber: 'SL-6654-B',
      make: 'Isuzu',
      model: 'D-Max',
      type: 'Pick-up',
      status: 'INDISPONIBLE',
      currentTrackerId: 'tr-005',
      assignedDriverId: 'd4',
      assignedDriverName: 'Cheikh Fall',
      odometerKm: 119800,
      fuelLevelPercent: 60,
      lastPosition: {
        vehicleId: 'v5',
        trackerId: 'tr-005',
        latitude: 14.7500,
        longitude: -17.3800,
        eventTime: new Date(Date.now() - 14400 * 1000).toISOString(),
        receivedAt: new Date(Date.now() - 14390 * 1000).toISOString(),
        speedKph: 0,
        heading: 45,
        ignition: false,
        freshnessSeconds: 14400
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
      originName: 'Port Autonome de Dakar',
      destinationName: 'Plateforme Industrielle Diamniadio',
      plannedStartTime: new Date(Date.now() - 3600 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 7200 * 1000).toISOString(),
      actualStartTime: new Date(Date.now() - 3400 * 1000).toISOString(),
      distanceKm: 42,
      departureDeclared: true,
      gpsDepartureDetected: true,
      notes: 'Colis prioritaires et fragiles. Respecter les limitations de vitesse.'
    },
    {
      id: 'm2',
      code: 'MIS-2026-090',
      title: 'Livraison Clients Centre-Ville Plateau',
      status: 'EN_COURS',
      vehicleId: 'v2',
      vehicleReg: 'DK-8112-BB',
      driverId: 'd2',
      driverName: 'Abdoulaye Ndiaye',
      originName: 'Dépôt Hann Bel-Air',
      destinationName: 'Dakar Plateau Commercial',
      plannedStartTime: new Date(Date.now() - 5400 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 1800 * 1000).toISOString(),
      actualStartTime: new Date(Date.now() - 5200 * 1000).toISOString(),
      distanceKm: 18,
      departureDeclared: true,
      gpsDepartureDetected: true
    },
    {
      id: 'm3',
      code: 'MIS-2026-091',
      title: 'Transport Matériaux Thiès ➔ Dakar',
      status: 'PLANIFIEE',
      vehicleId: 'v3',
      vehicleReg: 'TH-3310-A',
      driverId: 'd3',
      driverName: 'Ousmane Sow',
      originName: 'Carrière de Thiès',
      destinationName: 'Chantier VDN Extension Dakar',
      plannedStartTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 18000 * 1000).toISOString(),
      distanceKm: 78,
      departureDeclared: false,
      gpsDepartureDetected: false
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
      originName: 'Dakar Yoff',
      destinationName: 'Rufisque Centre',
      plannedStartTime: new Date(Date.now() - 86400 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() - 75000 * 1000).toISOString(),
      actualStartTime: new Date(Date.now() - 86000 * 1000).toISOString(),
      actualEndTime: new Date(Date.now() - 74800 * 1000).toISOString(),
      distanceKm: 32,
      departureDeclared: true,
      arrivalDeclared: true,
      gpsDepartureDetected: true
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
      occurredAt: 'Il y a 12 min',
      status: 'NOUVELLE',
      description: 'Véhicule en dehors du corridor de livraison convenu (Zone Corniche Ouest).'
    },
    {
      id: 'alt-2',
      type: 'PERTE_SIGNAL',
      severity: 'MAJEURE',
      vehicleId: 'v4',
      vehicleReg: 'DK-1092-BC',
      occurredAt: 'Il y a 2 h',
      status: 'PRISE_EN_CHARGE',
      assignedTo: 'Agent Samba Kane',
      description: 'Aucune trame GPS reçue depuis 120 minutes (seuil max : 15 min).'
    },
    {
      id: 'alt-3',
      type: 'EXCES_VITESSE',
      severity: 'MINEURE',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      driverName: 'Mamadou Diallo',
      missionId: 'm1',
      occurredAt: 'Il y a 35 min',
      status: 'CLOTUREE',
      description: 'Vitesse de 96 km/h constatée sur la voie rapide limitée à 90 km/h.'
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

  getTripEvents(): Observable<TripEvent[]> {
    return this.tripEvents$.asObservable();
  }

  // Simulation pointage chauffeur
  declareDriverEvent(type: 'DEPART' | 'PAUSE' | 'REPRISE' | 'ARRIVEE' | 'INCIDENT', missionId: string, comment?: string): Observable<TripEvent> {
    const newEvent: TripEvent = {
      id: 'evt-' + Math.random().toString(36).substr(2, 9),
      missionId: missionId,
      vehicleId: 'v1',
      driverId: 'd1',
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

    // Update mission status in mock
    const missions = this.missions$.getValue();
    const targetMission = missions.find(m => m.id === missionId);
    if (targetMission) {
      if (type === 'DEPART') {
        targetMission.status = 'EN_COURS';
        targetMission.departureDeclared = true;
      } else if (type === 'ARRIVEE') {
        targetMission.status = 'TERMINEE';
        targetMission.arrivalDeclared = true;
      } else if (type === 'PAUSE') {
        targetMission.status = 'EN_PAUSE';
      } else if (type === 'REPRISE') {
        targetMission.status = 'EN_COURS';
      } else if (type === 'INCIDENT') {
        targetMission.status = 'EN_ANOMALIE';
      }
      this.missions$.next([...missions]);
    }

    return of(newEvent);
  }

  // Résoudre ou changer le statut d'une alerte
  updateAlertStatus(alertId: string, newStatus: 'PRISE_EN_CHARGE' | 'CLOTUREE' | 'IGNOREE') {
    const alerts = this.alerts$.getValue();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = newStatus;
      this.alerts$.next([...alerts]);
    }
  }
}
