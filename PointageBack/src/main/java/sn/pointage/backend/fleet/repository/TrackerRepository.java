package sn.pointage.backend.fleet.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.fleet.model.Tracker;

import java.util.Optional;

@Repository
public interface TrackerRepository extends JpaRepository<Tracker, Long> {
    Optional<Tracker> findByIdentifier(String identifier);
    Optional<Tracker> findByVehicleId(Long vehicleId);
}
