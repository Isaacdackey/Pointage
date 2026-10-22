import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Vehicle, Driver, Tracker, Mission, Alert, GpsPosition, TripEvent } from '../models/fleet.models';
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
      status: 'PLANIFIEE',
      vehicleId: 'v1',
      vehicleReg: 'DK-4920-BA',
      driverId: 'd1',
      driverName: 'Mamadou Diallo',
      originName: 'Port Autonome de Dakar',
      destinationName: 'Plateforme Industrielle Diamniadio',
      plannedStartTime: new Date(Date.now() + 1800 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 9000 * 1000).toISOString(),
      distanceKm: 42,
      departureDeclared: false,
      gpsDepartureDetected: false,
      notes: 'Colis prioritaires et fragiles. Respecter les limitations de vitesse.'
    },
    {
      id: 'm2',
      code: 'MIS-2026-090',
      title: 'Livraison Clients Centre-Ville Plateau',
      status: 'ATTENTE_VALIDATION',
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
      arrivalDeclared: true,
      gpsDepartureDetected: true,
      arrivalRequestedAt: 'Il y a 10 min'
    },
    {
      id: 'm3',
      code: 'MIS-2026-091',
      title: 'Transport Matériaux Thiès -> Dakar',
      status: 'DEMANDE_DEMARRAGE',
      vehicleId: 'v3',
      vehicleReg: 'TH-3310-A',
      driverId: 'd3',
      driverName: 'Ousmane Sow',
      originName: 'Carrière de Thiès',
      destinationName: 'Chantier VDN Extension Dakar',
      plannedStartTime: new Date(Date.now() - 1200 * 1000).toISOString(),
      plannedEndTime: new Date(Date.now() + 18000 * 1000).toISOString(),
      distanceKm: 78,
      departureDeclared: true,
      gpsDepartureDetected: true,
      departureRequestedAt: 'Il y a 3 min'
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

  addVehicle(newVehicle: {
    registrationNumber: string;
    make: string;
    model: string;
    type: string;
    odometerKm?: number;
    fuelLevelPercent?: number;
    assignedDriverId?: string;
    currentTrackerId?: string;
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
      type: newVehicle.type || 'Utilitaire',
      status: 'DISPONIBLE',
      currentTrackerId: trackerId,
      assignedDriverId: newVehicle.assignedDriverId,
      assignedDriverName: assignedDriver?.fullName,
      odometerKm: newVehicle.odometerKm || 0,
      fuelLevelPercent: newVehicle.fuelLevelPercent ?? 100,
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
      distanceKm: newMission.distanceKm || 35,
      plannedStartTime: newMission.plannedStartTime || new Date().toISOString(),
      plannedEndTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      departureDeclared: false,
      gpsDepartureDetected: false,
      notes: newMission.notes
    };

    const currentMissions = this.missions$.getValue();
    this.missions$.next([mission, ...currentMissions]);

    this.notificationService.sendPushNotification({
      title: 'Nouvelle Mission Planifiée',
      body: `${mission.code} : ${mission.title} assignée à ${mission.driverName} (${mission.vehicleReg}).`
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

  
  updateAlertStatus(alertId: string, newStatus: 'PRISE_EN_CHARGE' | 'CLOTUREE' | 'IGNOREE') {
    const alerts = this.alerts$.getValue();
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = newStatus;
      this.alerts$.next([...alerts]);
      if (newStatus === 'CLOTUREE') {
        this.notificationService.sendPushNotification({
          title: 'Alerte clôturée',
          body: `L'anomalie sur le véhicule ${alert.vehicleReg} a été résolue.`
        });
      }
    }
  }
}
