package sn.pointage.backend.fleet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.fleet.model.GpsPosition;

import java.util.List;

@Repository
public interface GpsPositionRepository extends JpaRepository<GpsPosition, Long> {
    List<GpsPosition> findByVehicleIdOrderByEventTimeDesc(Long vehicleId);
}
