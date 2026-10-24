package sn.pointage.backend.fleet.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.fleet.dto.GpsIngestRequest;
import sn.pointage.backend.fleet.dto.VehicleRequest;
import sn.pointage.backend.fleet.model.*;
import sn.pointage.backend.fleet.repository.*;
import sn.pointage.backend.shared.exception.EntityNotFoundException;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class FleetService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TrackerRepository trackerRepository;
    private final GpsPositionRepository gpsPositionRepository;

    public FleetService(VehicleRepository vehicleRepository,
                        DriverRepository driverRepository,
                        TrackerRepository trackerRepository,
                        GpsPositionRepository gpsPositionRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.trackerRepository = trackerRepository;
        this.gpsPositionRepository = gpsPositionRepository;
    }

    // --- Véhicules ---
    @Transactional(readOnly = true)
    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Véhicule non trouvé avec l'ID: " + id));
    }

    public Vehicle createVehicle(VehicleRequest request) {
        if (vehicleRepository.findByRegistrationNumber(request.registrationNumber()).isPresent()) {
            throw new IllegalArgumentException("Un véhicule avec cette immatriculation existe déjà: " + request.registrationNumber());
        }

        Vehicle v = new Vehicle();
        copyProperties(request, v);
        return vehicleRepository.save(v);
    }

    public Vehicle updateVehicle(Long id, VehicleRequest request) {
        Vehicle v = getVehicleById(id);
        copyProperties(request, v);
        return vehicleRepository.save(v);
    }

    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new EntityNotFoundException("Véhicule non trouvé avec l'ID: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    private void copyProperties(VehicleRequest request, Vehicle v) {
        v.setRegistrationNumber(request.registrationNumber());
        v.setMake(request.make());
        v.setModel(request.model());
        v.setType(request.type());
        if (request.status() != null) v.setStatus(request.status());
        v.setCurrentTrackerId(request.currentTrackerId());
        v.setAssignedDriverId(request.assignedDriverId());
        if (request.odometerKm() != null) v.setOdometerKm(request.odometerKm());
        v.setTechnicalInspectionExpiry(request.technicalInspectionExpiry());
        v.setInsuranceExpiry(request.insuranceExpiry());
        v.setRegistrationCardNumber(request.registrationCardNumber());
        if (request.canCutEngineRemotely() != null) v.setCanCutEngineRemotely(request.canCutEngineRemotely());

        if (request.assignedDriverId() != null) {
            driverRepository.findById(request.assignedDriverId()).ifPresent(d -> {
                v.setAssignedDriverName(d.getFullName());
                v.setAssignedDriverPhone(d.getPhone());
            });
        }
    }

    // --- Télématique Passive (GPS Ingestion) ---
    public GpsPosition recordGpsPosition(GpsIngestRequest request) {
        Vehicle v = getVehicleById(request.vehicleId());

        GpsPosition pos = new GpsPosition();
        pos.setVehicleId(v.getId());
        pos.setTrackerId(request.trackerId());
        pos.setLatitude(request.latitude());
        pos.setLongitude(request.longitude());
        pos.setSpeedKph(request.speedKph() != null ? request.speedKph() : 0.0);
        pos.setHeading(request.heading() != null ? request.heading() : 0);
        pos.setIgnition(request.ignition() != null ? request.ignition() : false);
        pos.setEventTime(request.eventTime() != null ? request.eventTime() : Instant.now());
        pos.setReceivedAt(Instant.now());

        GpsPosition saved = gpsPositionRepository.save(pos);

        // Mettre à jour en temps réel la dernière position du véhicule
        v.setLastLatitude(saved.getLatitude());
        v.setLastLongitude(saved.getLongitude());
        v.setLastSpeedKph(saved.getSpeedKph());
        v.setLastHeading(saved.getHeading());
        v.setLastIgnition(saved.getIgnition());
        v.setLastGpsTime(saved.getEventTime());
        vehicleRepository.save(v);

        // Mettre à jour le traceur lastSeenAt
        trackerRepository.findByIdentifier(request.trackerId()).ifPresent(t -> {
            t.setLastSeenAt(Instant.now());
            t.setVehicleId(v.getId());
            trackerRepository.save(t);
        });

        return saved;
    }

    // --- Chauffeurs (Driver) ---
    @Transactional(readOnly = true)
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    // --- Traceurs (Tracker) ---
    @Transactional(readOnly = true)
    public List<Tracker> getAllTrackers() {
        return trackerRepository.findAll();
    }

    public Tracker createTracker(Tracker tracker) {
        return trackerRepository.save(tracker);
    }
}
