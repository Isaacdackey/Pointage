package sn.pointage.backend.mission.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.fleet.model.Driver;
import sn.pointage.backend.fleet.model.Vehicle;
import sn.pointage.backend.fleet.model.VehicleStatus;
import sn.pointage.backend.fleet.repository.DriverRepository;
import sn.pointage.backend.fleet.repository.VehicleRepository;
import sn.pointage.backend.mission.dto.MissionRequest;
import sn.pointage.backend.mission.model.Mission;
import sn.pointage.backend.mission.model.MissionStatus;
import sn.pointage.backend.mission.repository.MissionRepository;
import sn.pointage.backend.shared.exception.EntityNotFoundException;

import java.time.Instant;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class MissionService {

    private final MissionRepository missionRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public MissionService(MissionRepository missionRepository,
                          VehicleRepository vehicleRepository,
                          DriverRepository driverRepository) {
        this.missionRepository = missionRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    @Transactional(readOnly = true)
    public List<Mission> getAllMissions() {
        return missionRepository.findAllByOrderByPlannedStartTimeDesc();
    }

    @Transactional(readOnly = true)
    public Mission getMissionById(Long id) {
        return missionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Mission non trouvée avec l'ID: " + id));
    }

    public Mission createMission(MissionRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Véhicule non trouvé avec l'ID: " + request.vehicleId()));

        Driver driver = driverRepository.findById(request.driverId())
                .orElseThrow(() -> new EntityNotFoundException("Chauffeur non trouvé avec l'ID: " + request.driverId()));

        Mission mission = new Mission();
        mission.setCode("MIS-2026-" + (100 + new Random().nextInt(900)));
        mission.setTitle(request.title());
        mission.setStatus(MissionStatus.PLANIFIEE);
        mission.setVehicleId(vehicle.getId());
        mission.setVehicleReg(vehicle.getRegistrationNumber());
        mission.setDriverId(driver.getId());
        mission.setDriverName(driver.getFullName());
        mission.setOriginName(request.originName());
        mission.setDestinationName(request.destinationName());
        mission.setOriginSiteId(request.originSiteId());
        mission.setDestinationSiteId(request.destinationSiteId());
        mission.setPlannedStartTime(request.plannedStartTime());
        mission.setPlannedEndTime(request.plannedEndTime());
        mission.setDistanceKm(request.distanceKm() != null ? request.distanceKm() : 0.0);
        mission.setNotes(request.notes());

        // Mettre à jour le statut du véhicule si mission en cours
        return missionRepository.save(mission);
    }

    public Mission updateStatus(Long id, MissionStatus newStatus) {
        Mission mission = getMissionById(id);
        mission.setStatus(newStatus);

        if (newStatus == MissionStatus.EN_COURS && mission.getActualStartTime() == null) {
            mission.setActualStartTime(Instant.now());
            mission.setGpsDepartureDetected(true);
            vehicleRepository.findById(mission.getVehicleId()).ifPresent(v -> {
                v.setStatus(VehicleStatus.EN_MISSION);
                vehicleRepository.save(v);
            });
        } else if (newStatus == MissionStatus.TERMINEE) {
            mission.setActualEndTime(Instant.now());
            mission.setGpsArrivalDetected(true);
            mission.setCurrentProgressPercent(100);
            vehicleRepository.findById(mission.getVehicleId()).ifPresent(v -> {
                v.setStatus(VehicleStatus.DISPONIBLE);
                vehicleRepository.save(v);
            });
            driverRepository.findById(mission.getDriverId()).ifPresent(d -> {
                d.setCompletedMissions(d.getCompletedMissions() + 1);
                driverRepository.save(d);
            });
        }

        return missionRepository.save(mission);
    }

    public void deleteMission(Long id) {
        if (!missionRepository.existsById(id)) {
            throw new EntityNotFoundException("Mission non trouvée avec l'ID: " + id);
        }
        missionRepository.deleteById(id);
    }
}
