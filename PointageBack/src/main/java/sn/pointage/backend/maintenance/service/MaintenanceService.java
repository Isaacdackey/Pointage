package sn.pointage.backend.maintenance.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.fleet.model.Vehicle;
import sn.pointage.backend.fleet.repository.VehicleRepository;
import sn.pointage.backend.maintenance.dto.MaintenanceRequest;
import sn.pointage.backend.maintenance.model.MaintenanceRecord;
import sn.pointage.backend.maintenance.model.MaintenanceStatus;
import sn.pointage.backend.maintenance.repository.MaintenanceRecordRepository;
import sn.pointage.backend.shared.exception.EntityNotFoundException;

import java.util.List;

@Service
@Transactional
public class MaintenanceService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceService(MaintenanceRecordRepository maintenanceRecordRepository,
                              VehicleRepository vehicleRepository) {
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> getAllRecords() {
        return maintenanceRecordRepository.findAllByOrderByServiceDateDesc();
    }

    @Transactional(readOnly = true)
    public List<MaintenanceRecord> getRecordsByVehicleId(Long vehicleId) {
        return maintenanceRecordRepository.findByVehicleIdOrderByServiceDateDesc(vehicleId);
    }

    public MaintenanceRecord createRecord(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
                .orElseThrow(() -> new EntityNotFoundException("Véhicule non trouvé avec l'ID: " + request.vehicleId()));

        MaintenanceRecord record = new MaintenanceRecord();
        record.setVehicleId(vehicle.getId());
        record.setVehicleReg(vehicle.getRegistrationNumber());
        record.setType(request.type());
        record.setTitle(request.title());
        record.setDescription(request.description());
        record.setServiceDate(request.serviceDate());
        record.setCostCfa(request.costCfa());
        record.setProvider(request.provider());
        record.setOdometerKm(request.odometerKm());
        record.setStatus(request.status() != null ? request.status() : MaintenanceStatus.TERMINEE);
        record.setPerformedBy(request.performedBy());
        record.setNextDueDate(request.nextDueDate());
        record.setNextDueOdometerKm(request.nextDueOdometerKm());

        // Mettre à jour le compteur kilométrique du véhicule si supérieur
        if (request.odometerKm() > vehicle.getOdometerKm()) {
            vehicle.setOdometerKm(request.odometerKm());
            vehicleRepository.save(vehicle);
        }

        return maintenanceRecordRepository.save(record);
    }

    public void deleteRecord(Long id) {
        if (!maintenanceRecordRepository.existsById(id)) {
            throw new EntityNotFoundException("Intervention de maintenance non trouvée avec l'ID: " + id);
        }
        maintenanceRecordRepository.deleteById(id);
    }
}
