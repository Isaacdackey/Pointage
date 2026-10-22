# Analyse Complète du Cahier des Charges
## Plateforme de Gestion et de Suivi GPS des Flottes de Véhicules

**Document analysé** : `Cahier_des_charges_plateforme_suivi_flotte_GPS_Angular_Spring_Boot.docx` (Version 1.0)  
**Stack technologique imposée** : 
- **Frontend** : Angular (version 19.2.0 déjà initialisée dans `PointageFront`)
- **Backend** : Java / Spring Boot (à créer dans `PointageBack`)
- **Base de données** : PostgreSQL + PostGIS (support géospatial)
- **Temps réel / Cache** : WebSocket (ou SSE), Redis (recommandé en option)

---

## 1. Vision et Objectifs Stratégiques

L'objectif principal est de fournir une solution complète et sécurisée permettant de :
1. **Superviser en temps réel** la flotte sur une carte interactive (dernière position, fraîcheur du signal, statut de marche/arrêt).
2. **Reconstituer les parcours réels** (historique GPS avec détection des anomalies, arrêts, vitesse).
3. **Gérer le cycle de vie des missions** (planification, affectation véhicule/chauffeur, vérification des conflits d'agenda).
4. **Fiabiliser le pointage opérationnel** :
   - Le chauffeur déclare ses événements (*Départ, Pause, Reprise, Arrivée, Incidents*).
   - L'agent de contrôle compare les déclarations déclaratives humaines avec la vérité terrain mesurée par les traceurs GPS sans altérer les données brutes.
5. **Garantir l'auditabilité et la conformité** (conservation sécurisée des traces, détection de fraude, respect de la vie privée).

---

## 2. Acteurs et Rôles (Matrice RBAC)

| Rôle | Périmètre d'action principal | Écrans / Fonctionnalités clés |
| :--- | :--- | :--- |
| **Administrateur** | Gestion globale du système et paramétrage | Gestion des comptes utilisateurs, véhicules, traceurs GPS, missions, seuils d'alertes, journal d'audit complet, rapports globaux. |
| **Agent de contrôle** | Supervision opérationnelle continue | Carte en direct (live tracking), console de vérification des départs/arrivées, qualification des anomalies, traitement et clôture des alertes. |
| **Chauffeur** | Exécution de la mission sur mobile/tablette | Interface épurée et sécurisée à l'arrêt : consultation de ses missions, boutons d'action (*Départ*, *Arrivée*, *Pause*, *Incident*), mode hors-ligne. |
| **Superviseur** *(optionnel)* | Pilotage managérial | Vue consolidée, validation des rapports de synthèse et audit de l'équipe de contrôle. |
| **Technicien de flotte** *(optionnel)* | Maintenance matériel | Disponibilité technique des véhicules, contrôle des traceurs, échéances administratives (assurances, visites techniques). |

---

## 3. Architecture Fonctionnelle & Métier

### A. Cycle de vie d'une Mission & Événements de Pointage
```
[Brouillon] ➔ [Planifiée] ➔ [En cours] ➔ [En pause] ➔ [Terminée]
                                  │
                                  └──> [En anomalie] / [Annulée]
```
- **Création / Affectation** : Contrôle strict anti-chevauchement (un véhicule ou un chauffeur ne peut pas être engagé sur deux missions simultanées).
- **Déclarations Chauffeur (Pointage)** :
  - **Idempotence obligatoire** (clé d'idempotence pour éliminer les doubles clics ou rejeux réseau).
  - **Support du mode déconnecté (Offline-first)** : stockage local des pointages dans le navigateur/PWA, synchronisation automatique dès retour du réseau avec horodatage local fiable.
  - Horodatage triple : heure déclarée par le chauffeur, heure GPS locale du terminal, heure de réception serveur UTC.

### B. Moteur d'Ingestion GPS et Résilience
- **Séparation stricte** des données déclaratives et des données GPS brutes.
- **Modèle de position normalisé** : `trackerId`, `vehicleId`, `latitude`, `longitude`, `eventTime`, `receivedAt`, `speedKph`, `heading`, `ignition`, `odometer`, `qualityFlags`.
- **Validation & Nettoyage** :
  - Rejet ou mise en quarantaine des messages corrompus ou hors plage.
  - Déduplication basée sur identifiant source/heure.
  - Gestion des messages hors séquence (ne jamais écraser une position plus récente par un paquet retardé).
  - **Indicateur de fraîcheur visuel** : avertissement clair si un traceur est muet ou hors ligne.

### C. Moteur d'Alertes et Règles de Gestion
- **Perte de signal** : alerte si silence supérieur au seuil configuré.
- **Retards** : dépassement de l'horaire prévu au départ ou à l'arrivée.
- **Sortie de zone (Geofencing)** : franchissement des zones géographiques PostGIS.
- **Départ non déclaré** : mouvement GPS détecté sans pointage de départ initié par le chauffeur.
- **Écart de parcours** et **Excès de vitesse**.

---

## 4. Architecture Technique & Découpage des Projets

### Frontend (`PointageFront` - Angular 19)
- **Architecture modulaire / Standalone components** :
  - `core/` : Auth, guards fonctionnels, interceptor HTTP (JWT, injection de corrélation, refresh token), gestion d'erreurs globale.
  - `shared/` : Composants UI, widgets carte (Leaflet / OpenLayers ou Mapbox), modales de confirmation, badges de statut, tables paginées.
  - `features/dashboard/` : KPIs, compteurs flotte (en route, arrêt, muet, retard).
  - `features/map/` : Carte temps réel via WebSocket/SSE, couche géométrique, trajets historiques.
  - `features/fleet/` : CRUD véhicules, chauffeurs, boîtiers GPS, associations temporelles.
  - `features/missions/` : Planificateur de missions, affectations.
  - `features/driver/` : Vue PWA mobile responsive pour le chauffeur (boutons larges, usage à l'arrêt, gestion cache IndexedDB offline).
  - `features/control/` : Console des agents, comparateur déclaration vs GPS, gestion des alertes.
  - `features/reports/` : Exports CSV, Excel et visualisations statistiques.
  - `features/admin/` : Gestion des utilisateurs, rôles, logs d'audit.

### Backend (`PointageBack` - Java / Spring Boot)
- **Monolithe modulaire avec séparation de couches** :
  - `auth` : Spring Security + JWT, RBAC.
  - `fleet` : Entités `Vehicle`, `DriverProfile`, `Tracker`, `VehicleTrackerAssignment`.
  - `mission` : Entités `Mission`, `MissionAssignment`, `TripEvent`.
  - `tracking` : Ingestion des paquets GPS, calculs géospatiaux PostGIS (table partitionnée `GpsPosition`), gestion WebSocket.
  - `control` : Moteur d'évaluation de règles et d'alertes (`Alert`, `Geofence`).
  - `reporting` : Services d'agrégation et génération de documents.
  - `audit` : Écouteur d'événements et entité `AuditLog` immuable.

---

## 5. Feuille de Route pour le Développement

1. **Phase 1 : Socle Backend & Base de Données (`PointageBack`)**
   - Initialiser le projet Spring Boot 3.x (Java 17/21, Spring Data JPA, Spring Security, PostgreSQL/PostGIS, Flyway/Liquibase).
   - Modéliser la base relationnelle et spatiale.
   - Implémenter l'authentification JWT et la gestion des utilisateurs / rôles.

2. **Phase 2 : Référentiels Flotte & Missions**
   - CRUD Véhicules, Chauffeurs, Boîtiers GPS avec affectations temporelles.
   - Planification de missions et contrôles de collision.

3. **Phase 3 : Module GPS & Temps Réel**
   - API d'ingestion GPS (REST + simulation de protocoles de traceurs).
   - Persistance PostGIS et diffusion WebSocket/STOMP.
   - Console de supervision et carte interactive sur Angular.

4. **Phase 4 : Espace Chauffeur (Pointage Mobile & Offline)**
   - Écran chauffeur adapté mobile, déclarations Départ/Arrivée/Incident.
   - Synchronisation offline avec Service Worker et IndexedDB.

5. **Phase 5 : Console de Contrôle, Alertes & Reporting**
   - Moteur de détection des anomalies (départ non déclaré, retard, silence GPS).
   - Console agent pour valider/rejeter les pointages.
   - Tableaux de bord et exports.
