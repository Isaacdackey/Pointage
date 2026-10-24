package sn.pointage.backend.mission.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.pointage.backend.mission.model.Mission;
import sn.pointage.backend.mission.model.MissionStatus;

import java.util.List;
import java.util.Optional;

@Repository
public interface MissionRepository extends JpaRepository<Mission, Long> {
    Optional<Mission> findByCode(String code);
    List<Mission> findByVehicleId(Long vehicleId);
    List<Mission> findByStatus(MissionStatus status);
    List<Mission> findAllByOrderByPlannedStartTimeDesc();
}
