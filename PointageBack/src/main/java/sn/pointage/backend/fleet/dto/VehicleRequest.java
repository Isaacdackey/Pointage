package sn.pointage.backend.fleet.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sn.pointage.backend.fleet.model.VehicleStatus;
import sn.pointage.backend.fleet.model.VehicleType;

import java.time.LocalDate;

public record VehicleRequest(
    @NotBlank(message = "L'immatriculation est obligatoire")
    String registrationNumber,

    @NotBlank(message = "La marque est obligatoire")
    String make,

    @NotBlank(message = "Le modèle est obligatoire")
    String model,

    @NotNull(message = "Le type de véhicule est obligatoire")
    VehicleType type,

    VehicleStatus status,
    String currentTrackerId,
    Long assignedDriverId,
    Integer odometerKm,
    LocalDate technicalInspectionExpiry,
    LocalDate insuranceExpiry,
    String registrationCardNumber,
    Boolean canCutEngineRemotely
) {}
