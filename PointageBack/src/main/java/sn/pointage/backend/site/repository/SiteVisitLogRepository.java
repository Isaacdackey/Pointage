package sn.pointage.backend.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.site.model.SiteVisitLog;

import java.util.List;

@Repository
public interface SiteVisitLogRepository extends JpaRepository<SiteVisitLog, Long> {
    List<SiteVisitLog> findByOrderByEnteredAtDesc();
    List<SiteVisitLog> findBySiteIdOrderByEnteredAtDesc(Long siteId);
}
