package sn.pointage.backend.maintenance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sn.pointage.backend.maintenance.model.DeadlineType;

import java.time.LocalDate;

public record ScheduledDeadlineRequest(
    @NotNull(message = "Le véhicule est obligatoire")
    Long vehicleId,

    @NotNull(message = "Le type d'échéance est obligatoire")
    DeadlineType type,

    @NotBlank(message = "Le titre est obligatoire")
    String title,

    @NotNull(message = "La date d'échéance est obligatoire")
    LocalDate dueDate,

    Integer reminderLeadDays,

    Integer odometerDueKm,

    String providerOrPolicyNumber,

    String notes
) {}

