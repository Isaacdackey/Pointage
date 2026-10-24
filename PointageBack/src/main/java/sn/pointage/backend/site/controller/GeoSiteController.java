package sn.pointage.backend.site.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sn.pointage.backend.shared.response.RestResponse;
import sn.pointage.backend.site.dto.GeoSiteRequest;
import sn.pointage.backend.site.model.GeoSite;
import sn.pointage.backend.site.model.SiteVisitLog;
import sn.pointage.backend.site.service.GeoSiteService;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
@RequiredArgsConstructor
public class GeoSiteController {

    private final GeoSiteService siteService;

    @GetMapping
    public ResponseEntity<RestResponse<List<GeoSite>>> getAllSites() {
        List<GeoSite> sites = siteService.getAllSites();
        return ResponseEntity.ok(RestResponse.success(sites, "Liste des sites favoris"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestResponse<GeoSite>> getSiteById(@PathVariable Long id) {
        GeoSite site = siteService.getSiteById(id);
        return ResponseEntity.ok(RestResponse.success(site, "Détails du site"));
    }

    @PostMapping
    public ResponseEntity<RestResponse<GeoSite>> createSite(@Valid @RequestBody GeoSiteRequest request) {
        GeoSite site = siteService.createSite(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(RestResponse.success(site, HttpStatus.CREATED));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestResponse<GeoSite>> updateSite(
        @PathVariable Long id,
        @Valid @RequestBody GeoSiteRequest request
    ) {
        GeoSite site = siteService.updateSite(id, request);
        return ResponseEntity.ok(RestResponse.success(site, "Site favori mis à jour"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<RestResponse<Void>> deleteSite(@PathVariable Long id) {
        siteService.deleteSite(id);
        return ResponseEntity.ok(RestResponse.success(null, "Site favori supprimé avec succès"));
    }

    @GetMapping("/visits/logs")
    public ResponseEntity<RestResponse<List<SiteVisitLog>>> getAllVisits() {
        List<SiteVisitLog> visits = siteService.getAllVisits();
        return ResponseEntity.ok(RestResponse.success(visits, "Journal des passages automatiques"));
    }
}
