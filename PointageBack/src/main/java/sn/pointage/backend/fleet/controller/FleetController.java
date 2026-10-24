package sn.pointage.backend.fleet.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.fleet.dto.GpsIngestRequest;
import sn.pointage.backend.fleet.dto.VehicleRequest;
import sn.pointage.backend.fleet.model.*;
import sn.pointage.backend.fleet.service.FleetService;
import sn.pointage.backend.shared.response.RestResponse;

import java.util.List;

@RestController
@RequestMapping("/api/fleet")
public class FleetController {

    private final FleetService fleetService;

    public FleetController(FleetService fleetService) {
        this.fleetService = fleetService;
    }

    // --- Véhicules ---
    @GetMapping("/vehicles")
    public ResponseEntity<RestResponse<List<Vehicle>>> getAllVehicles() {
        return ResponseEntity.ok(RestResponse.success(fleetService.getAllVehicles(), "Liste des véhicules récupérée"));
    }

    @GetMapping("/vehicles/{id}")
    public ResponseEntity<RestResponse<Vehicle>> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(RestResponse.success(fleetService.getVehicleById(id), "Véhicule trouvé"));
    }

    @PostMapping("/vehicles")
    public ResponseEntity<RestResponse<Vehicle>> createVehicle(@Valid @RequestBody VehicleRequest request) {
        Vehicle created = fleetService.createVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(created, "Véhicule créé avec succès"));
    }

    @PutMapping("/vehicles/{id}")
    public ResponseEntity<RestResponse<Vehicle>> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        Vehicle updated = fleetService.updateVehicle(id, request);
        return ResponseEntity.ok(RestResponse.success(updated, "Véhicule mis à jour avec succès"));
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<RestResponse<Void>> deleteVehicle(@PathVariable Long id) {
        fleetService.deleteVehicle(id);
        return ResponseEntity.ok(RestResponse.success(null, "Véhicule supprimé avec succès"));
    }

    // --- Télématique Passive GPS (Ingestion IoT sans interaction chauffeur) ---
    @PostMapping("/telematics/positions")
    public ResponseEntity<RestResponse<GpsPosition>> recordGpsPosition(@Valid @RequestBody GpsIngestRequest request) {
        GpsPosition pos = fleetService.recordGpsPosition(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(pos, "Position GPS ingérée"));
    }

    // --- Chauffeurs ---
    @GetMapping("/drivers")
    public ResponseEntity<RestResponse<List<Driver>>> getAllDrivers() {
        return ResponseEntity.ok(RestResponse.success(fleetService.getAllDrivers(), "Liste des chauffeurs récupérée"));
    }

    @PostMapping("/drivers")
    public ResponseEntity<RestResponse<Driver>> createDriver(@Valid @RequestBody Driver driver) {
        Driver created = fleetService.createDriver(driver);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(created, "Chauffeur créé avec succès"));
    }

    // --- Traceurs GPS ---
    @GetMapping("/trackers")
    public ResponseEntity<RestResponse<List<Tracker>>> getAllTrackers() {
        return ResponseEntity.ok(RestResponse.success(fleetService.getAllTrackers(), "Liste des traceurs récupérée"));
    }

    @PostMapping("/trackers")
    public ResponseEntity<RestResponse<Tracker>> createTracker(@Valid @RequestBody Tracker tracker) {
        Tracker created = fleetService.createTracker(tracker);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(created, "Traceur créé avec succès"));
    }
}
