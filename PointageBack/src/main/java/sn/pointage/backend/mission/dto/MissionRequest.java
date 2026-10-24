package sn.pointage.backend.mission.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record MissionRequest(
    @NotBlank(message = "Le titre est obligatoire")
    String title,

    @NotNull(message = "Le véhicule est obligatoire")
    Long vehicleId,

    @NotNull(message = "Le chauffeur est obligatoire")
    Long driverId,

    @NotBlank(message = "Le lieu de départ est obligatoire")
    String originName,

    @NotBlank(message = "Le lieu de destination est obligatoire")
    String destinationName,

    Long originSiteId,
    Long destinationSiteId,

    @NotNull(message = "L'heure de départ prévue est obligatoire")
    Instant plannedStartTime,

    @NotNull(message = "L'heure d'arrivée prévue est obligatoire")
    Instant plannedEndTime,

    Double distanceKm,
    String notes
) {}
