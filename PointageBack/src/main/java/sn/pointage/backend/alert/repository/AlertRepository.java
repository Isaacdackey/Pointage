package sn.pointage.backend.alert.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.alert.model.Alert;
import sn.pointage.backend.alert.model.AlertStatus;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findAllByOrderByOccurredAtDesc();
    List<Alert> findByStatus(AlertStatus status);
    List<Alert> findByVehicleId(Long vehicleId);
}
