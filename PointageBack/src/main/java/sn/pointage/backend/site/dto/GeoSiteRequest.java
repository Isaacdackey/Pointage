package sn.pointage.backend.site.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import sn.pointage.backend.site.model.SiteCategory;

public record GeoSiteRequest(
    @NotBlank(message = "Le nom du site est obligatoire")
    String name,

    @NotNull(message = "La catégorie est obligatoire")
    SiteCategory category,

    @NotBlank(message = "L'adresse est obligatoire")
    String address,

    @NotNull(message = "La latitude est obligatoire")
    Double latitude,

    @NotNull(message = "La longitude est obligatoire")
    Double longitude,

    Integer radiusMeters,
    Integer minStopDurationMinutes,
    String contactName,
    String contactPhone,
    String notes
) {}
