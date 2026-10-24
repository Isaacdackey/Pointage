package sn.pointage.backend.site.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.shared.exception.EntityNotFoundException;
import sn.pointage.backend.site.dto.GeoSiteRequest;
import sn.pointage.backend.site.model.GeoSite;
import sn.pointage.backend.site.model.SiteVisitLog;
import sn.pointage.backend.site.repository.GeoSiteRepository;
import sn.pointage.backend.site.repository.SiteVisitLogRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeoSiteService {

    private final GeoSiteRepository siteRepository;
    private final SiteVisitLogRepository visitLogRepository;

    @Transactional(readOnly = true)
    public List<GeoSite> getAllSites() {
        return siteRepository.findAll();
    }

    @Transactional(readOnly = true)
    public GeoSite getSiteById(Long id) {
        return siteRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Site favori introuvable"));
    }

    @Transactional
    public GeoSite createSite(GeoSiteRequest request) {
        GeoSite site = GeoSite.builder()
            .name(request.name().trim())
            .category(request.category())
            .address(request.address().trim())
            .latitude(request.latitude())
            .longitude(request.longitude())
            .radiusMeters(request.radiusMeters() != null ? request.radiusMeters() : 20)
            .minStopDurationMinutes(request.minStopDurationMinutes() != null ? request.minStopDurationMinutes() : 2)
            .contactName(request.contactName() != null ? request.contactName().trim() : null)
            .contactPhone(request.contactPhone() != null ? request.contactPhone().trim() : null)
            .notes(request.notes() != null ? request.notes().trim() : null)
            .build();

        return siteRepository.save(site);
    }

    @Transactional
    public GeoSite updateSite(Long id, GeoSiteRequest request) {
        GeoSite site = getSiteById(id);
        site.setName(request.name().trim());
        site.setCategory(request.category());
        site.setAddress(request.address().trim());
        site.setLatitude(request.latitude());
        site.setLongitude(request.longitude());
        if (request.radiusMeters() != null) site.setRadiusMeters(request.radiusMeters());
        if (request.minStopDurationMinutes() != null) site.setMinStopDurationMinutes(request.minStopDurationMinutes());
        site.setContactName(request.contactName());
        site.setContactPhone(request.contactPhone());
        site.setNotes(request.notes());

        return siteRepository.save(site);
    }

    @Transactional
    public void deleteSite(Long id) {
        GeoSite site = getSiteById(id);
        siteRepository.delete(site);
    }

    @Transactional(readOnly = true)
    public List<SiteVisitLog> getAllVisits() {
        return visitLogRepository.findByOrderByEnteredAtDesc();
    }
}
