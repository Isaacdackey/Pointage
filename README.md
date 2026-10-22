# GeoFleet GPS - Plateforme de Supervision et de Pointage de Flotte

Plateforme moderne de gestion, suivi GPS en temps réel et pointage des flottes de transport et missions de livraison.

## 🚀 Architecture du Projet

Le dépôt est structuré en deux parties principales :

- **`PointageFront/`** : Application Frontend développée avec **Angular 19** (Standalone Components, Leaflet pour la cartographie GPS interactive, Material Symbols, SCSS, design system accessible et réactif).
- **`PointageBack/`** : API Backend développée avec **Spring Boot 3** (Java 17+, Spring Security avec authentification JWT, Spring Data JPA / Hibernate, PostgreSQL, WebSocket pour les flux GPS temps réel).

---

## 🛠️ Démarrage Rapide

### 1. Frontend (Angular)

```bash
cd PointageFront
npm install
ng serve
```
L'application est accessible sur : `http://localhost:4200/`

### 2. Backend (Spring Boot)

1. Copier le fichier `.env.example` en `.env` dans le dossier `PointageBack/` :
```bash
cd PointageBack
cp .env.example .env
```
2. Renseigner vos identifiants PostgreSQL et JWT dans `.env`.
3. Lancer l'application Spring Boot :
```bash
./mvnw spring-boot:run
```
L'API est accessible sur : `http://localhost:8080/`

---

## ✨ Fonctionnalités Principales

- **Authentification multi-rôles** : Administrateur Général, Agent de Contrôle, Chauffeur.
- **Tableau de Bord & KPIs** : Suivi des véhicules en mission, taux de ponctualité, anomalies et alertes ouvertes.
- **Carte Live & Géolocalisation** : Suivi des balises GPS et véhicules en temps réel avec Leaflet.
- **Console de Contrôle** : Détection et traitement des anomalies de trajet (dévitation de couloir, excès de vitesse, perte de signal).
- **Interface Mobile Chauffeur** : Pointage début/fin de tournée, validation des étapes et signalement d'incidents.
- **Rapports & Audit** : Exports et synthèses d'activité de la flotte.
