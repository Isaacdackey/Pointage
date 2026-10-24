package sn.pointage.backend.fleet.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record GpsIngestRequest(
    @NotNull(message = "Le véhicule est obligatoire")
    Long vehicleId,

    @NotNull(message = "L'identifiant du tracker est obligatoire")
    String trackerId,

    @NotNull(message = "La latitude est obligatoire")
    Double latitude,

    @NotNull(message = "La longitude est obligatoire")
    Double longitude,

    Double speedKph,
    Integer heading,
    Boolean ignition,
    Instant eventTime
) {}
