package sn.pointage.backend.alert.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.alert.model.Alert;
import sn.pointage.backend.alert.model.AlertStatus;
import sn.pointage.backend.alert.service.AlertService;
import sn.pointage.backend.shared.response.RestResponse;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<RestResponse<List<Alert>>> getAllAlerts() {
        return ResponseEntity.ok(RestResponse.success(alertService.getAllAlerts(), "Liste des alertes récupérée"));
    }

    @GetMapping("/active")
    public ResponseEntity<RestResponse<List<Alert>>> getActiveAlerts() {
        return ResponseEntity.ok(RestResponse.success(alertService.getActiveAlerts(), "Alertes actives récupérées"));
    }

    @PostMapping
    public ResponseEntity<RestResponse<Alert>> createAlert(@RequestBody Alert alert) {
        Alert created = alertService.createAlert(alert);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(created, "Alerte créée"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RestResponse<Alert>> updateStatus(@PathVariable Long id,
                                                           @RequestParam AlertStatus status,
                                                           @RequestParam(required = false) String resolutionNote,
                                                           @RequestParam(required = false) String handledBy) {
        Alert updated = alertService.updateAlertStatus(id, status, resolutionNote, handledBy);
        return ResponseEntity.ok(RestResponse.success(updated, "Statut de l'alerte mis à jour"));
    }
}
