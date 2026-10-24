package sn.pointage.backend.maintenance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sn.pointage.backend.maintenance.model.MaintenanceStatus;
import sn.pointage.backend.maintenance.model.MaintenanceType;

import java.time.LocalDate;

public record MaintenanceRequest(
    @NotNull(message = "Le véhicule est obligatoire")
    Long vehicleId,

    @NotNull(message = "Le type d'intervention est obligatoire")
    MaintenanceType type,

    @NotBlank(message = "Le titre est obligatoire")
    String title,

    String description,

    @NotNull(message = "La date d'intervention est obligatoire")
    LocalDate serviceDate,

    @NotNull(message = "Le coût en FCFA est obligatoire")
    Double costCfa,

    @NotBlank(message = "Le prestataire est obligatoire")
    String provider,

    @NotNull(message = "Le kilométrage est obligatoire")
    Integer odometerKm,

    MaintenanceStatus status,
    String performedBy,
    LocalDate nextDueDate,
    Integer nextDueOdometerKm
) {}
