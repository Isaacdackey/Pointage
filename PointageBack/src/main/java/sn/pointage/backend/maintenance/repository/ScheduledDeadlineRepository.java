package sn.pointage.backend.maintenance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.maintenance.model.DeadlineType;
import sn.pointage.backend.maintenance.model.ScheduledDeadline;

import java.util.List;

@Repository
public interface ScheduledDeadlineRepository extends JpaRepository<ScheduledDeadline, Long> {
    List<ScheduledDeadline> findByVehicleId(Long vehicleId);
    List<ScheduledDeadline> findByType(DeadlineType type);
}

