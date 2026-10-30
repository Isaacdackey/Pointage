package sn.pointage.backend.maintenance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.fleet.model.Vehicle;
import sn.pointage.backend.fleet.repository.VehicleRepository;
import sn.pointage.backend.maintenance.dto.ScheduledDeadlineRequest;
import sn.pointage.backend.maintenance.model.DeadlineStatus;
import sn.pointage.backend.maintenance.model.DeadlineType;
import sn.pointage.backend.maintenance.model.ScheduledDeadline;
import sn.pointage.backend.maintenance.repository.ScheduledDeadlineRepository;
import sn.pointage.backend.shared.exception.EntityNotFoundException;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduledDeadlineService {

    private final ScheduledDeadlineRepository deadlineRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional(readOnly = true)
    public List<ScheduledDeadline> getAllDeadlines() {
        List<ScheduledDeadline> deadlines = deadlineRepository.findAll();
        deadlines.forEach(this::computeAndRefreshStatus);
        return deadlines;
    }

    @Transactional(readOnly = true)
    public List<ScheduledDeadline> getDeadlinesByVehicle(Long vehicleId) {
        List<ScheduledDeadline> deadlines = deadlineRepository.findByVehicleId(vehicleId);
        deadlines.forEach(this::computeAndRefreshStatus);
        return deadlines;
    }

    @Transactional(readOnly = true)
    public List<ScheduledDeadline> getDeadlinesByType(DeadlineType type) {
        List<ScheduledDeadline> deadlines = deadlineRepository.findByType(type);
        deadlines.forEach(this::computeAndRefreshStatus);
        return deadlines;
    }

    @Transactional
    public ScheduledDeadline createDeadline(ScheduledDeadlineRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.vehicleId())
            .orElseThrow(() -> new EntityNotFoundException("Véhicule introuvable avec l'ID: " + request.vehicleId()));

        int leadDays = (request.reminderLeadDays() != null && request.reminderLeadDays() > 0)
            ? request.reminderLeadDays()
            : 7;

        ScheduledDeadline deadline = ScheduledDeadline.builder()
            .vehicleId(vehicle.getId())
            .vehicleReg(vehicle.getRegistrationNumber())
            .type(request.type())
            .title(request.title().trim())
            .dueDate(request.dueDate())
            .reminderLeadDays(leadDays)
            .odometerDueKm(request.odometerDueKm())
            .currentOdometerKm(vehicle.getOdometerKm())
            .providerOrPolicyNumber(request.providerOrPolicyNumber() != null ? request.providerOrPolicyNumber().trim() : null)
            .notes(request.notes() != null ? request.notes().trim() : null)
            .build();

        computeAndRefreshStatus(deadline);
        return deadlineRepository.save(deadline);
    }

    @Transactional
    public void deleteDeadline(Long id) {
        if (!deadlineRepository.existsById(id)) {
            throw new EntityNotFoundException("Échéance introuvable avec l'ID: " + id);
        }
        deadlineRepository.deleteById(id);
    }

    private void computeAndRefreshStatus(ScheduledDeadline d) {
        if (d.getDueDate() == null) return;

        LocalDate today = LocalDate.now();
        long daysUntilDue = ChronoUnit.DAYS.between(today, d.getDueDate());
        int leadDays = d.getReminderLeadDays() != null ? d.getReminderLeadDays() : 7;

        if (daysUntilDue < 0) {
            d.setStatus(DeadlineStatus.EXPIRE);
        } else if (daysUntilDue <= 3) {
            d.setStatus(DeadlineStatus.URGENT);
        } else if (daysUntilDue <= leadDays) {
            d.setStatus(DeadlineStatus.A_PREVOIR);
        } else {
            d.setStatus(DeadlineStatus.VALIDE);
        }
    }
}

