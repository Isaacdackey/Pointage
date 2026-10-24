package sn.pointage.backend.mission.controller;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.mission.dto.MissionRequest;
import sn.pointage.backend.mission.model.Mission;
import sn.pointage.backend.mission.model.MissionStatus;
import sn.pointage.backend.mission.service.MissionService;
import sn.pointage.backend.shared.response.RestResponse;

import java.util.List;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @GetMapping
    public ResponseEntity<RestResponse<List<Mission>>> getAllMissions() {
        return ResponseEntity.ok(RestResponse.success(missionService.getAllMissions(), "Liste des missions récupérée"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestResponse<Mission>> getMissionById(@PathVariable Long id) {
        return ResponseEntity.ok(RestResponse.success(missionService.getMissionById(id), "Mission trouvée"));
    }

    @PostMapping
    public ResponseEntity<RestResponse<Mission>> createMission(@Valid @RequestBody MissionRequest request) {
        Mission created = missionService.createMission(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RestResponse.success(created, "Mission planifiée avec succès"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RestResponse<Mission>> updateStatus(@PathVariable Long id, @RequestParam MissionStatus status) {
        Mission updated = missionService.updateStatus(id, status);
        return ResponseEntity.ok(RestResponse.success(updated, "Statut de mission mis à jour"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponse<Void>> deleteMission(@PathVariable Long id) {
        missionService.deleteMission(id);
        return ResponseEntity.ok(RestResponse.success(null, "Mission supprimée"));
    }
}
