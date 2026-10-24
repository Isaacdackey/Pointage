package sn.pointage.backend.maintenance.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.maintenance.model.MaintenanceRecord;

import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {
    List<MaintenanceRecord> findByVehicleIdOrderByServiceDateDesc(Long vehicleId);
    List<MaintenanceRecord> findAllByOrderByServiceDateDesc();
}
