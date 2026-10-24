package sn.pointage.backend.maintenance.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.maintenance.dto.MaintenanceRequest;
import sn.pointage.backend.maintenance.model.MaintenanceRecord;
import sn.pointage.backend.maintenance.service.MaintenanceService;
import sn.pointage.backend.shared.response.RestResponse;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public ResponseEntity<RestResponse<List<MaintenanceRecord>>> getAllRecords() {
        return ResponseEntity.ok(RestResponse.success(maintenanceService.getAllRecords(), "Historique de maintenance récupéré"));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<RestResponse<List<MaintenanceRecord>>> getRecordsByVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(RestResponse.success(maintenanceService.getRecordsByVehicleId(vehicleId), "Entretiens du véhicule récupérés"));
    }

    @PostMapping
    public ResponseEntity<RestResponse<MaintenanceRecord>> createRecord(@Valid @RequestBody MaintenanceRequest request) {
        MaintenanceRecord created = maintenanceService.createRecord(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(created, "Intervention de maintenance enregistrée"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponse<Void>> deleteRecord(@PathVariable Long id) {
        maintenanceService.deleteRecord(id);
        return ResponseEntity.ok(RestResponse.success(null, "Intervention supprimée"));
    }
}
