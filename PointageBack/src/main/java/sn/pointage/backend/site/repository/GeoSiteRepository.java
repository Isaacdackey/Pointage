package sn.pointage.backend.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.site.model.GeoSite;

@Repository
public interface GeoSiteRepository extends JpaRepository<GeoSite, Long> {
}
