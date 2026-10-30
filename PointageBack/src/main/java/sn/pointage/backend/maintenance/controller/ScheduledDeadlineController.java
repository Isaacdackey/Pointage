package sn.pointage.backend.maintenance.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.maintenance.dto.ScheduledDeadlineRequest;
import sn.pointage.backend.maintenance.model.DeadlineType;
import sn.pointage.backend.maintenance.model.ScheduledDeadline;
import sn.pointage.backend.maintenance.service.ScheduledDeadlineService;
import sn.pointage.backend.shared.response.RestResponse;

import java.util.List;

@RestController
@RequestMapping("/api/deadlines")
@RequiredArgsConstructor
public class ScheduledDeadlineController {

    private final ScheduledDeadlineService deadlineService;

    @GetMapping
    public ResponseEntity<RestResponse<List<ScheduledDeadline>>> getAllDeadlines(
        @RequestParam(required = false) DeadlineType type
    ) {
        List<ScheduledDeadline> list = (type != null)
            ? deadlineService.getDeadlinesByType(type)
            : deadlineService.getAllDeadlines();
        return ResponseEntity.ok(RestResponse.success(list, "Liste des échéances programmées récupérée avec succès"));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<RestResponse<List<ScheduledDeadline>>> getDeadlinesByVehicle(@PathVariable Long vehicleId) {
        List<ScheduledDeadline> list = deadlineService.getDeadlinesByVehicle(vehicleId);
        return ResponseEntity.ok(RestResponse.success(list, "Échéances du véhicule récupérées avec succès"));
    }

    @PostMapping
    public ResponseEntity<RestResponse<ScheduledDeadline>> createDeadline(
        @Valid @RequestBody ScheduledDeadlineRequest request
    ) {
        ScheduledDeadline created = deadlineService.createDeadline(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(RestResponse.success(created, "Échéance programmée enregistrée avec succès"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponse<Void>> deleteDeadline(@PathVariable Long id) {
        deadlineService.deleteDeadline(id);
        return ResponseEntity.ok(RestResponse.success(null, "Échéance supprimée avec succès"));
    }
}

