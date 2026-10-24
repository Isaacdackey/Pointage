package sn.pointage.backend.alert.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sn.pointage.backend.alert.model.Alert;
import sn.pointage.backend.alert.model.AlertStatus;
import sn.pointage.backend.alert.repository.AlertRepository;
import sn.pointage.backend.shared.exception.EntityNotFoundException;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @Transactional(readOnly = true)
    public List<Alert> getAllAlerts() {
        return alertRepository.findAllByOrderByOccurredAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Alert> getActiveAlerts() {
        return alertRepository.findByStatus(AlertStatus.NOUVELLE);
    }

    public Alert createAlert(Alert alert) {
        return alertRepository.save(alert);
    }

    public Alert updateAlertStatus(Long id, AlertStatus status, String resolutionNote, String handledBy) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Alerte non trouvée avec l'ID: " + id));

        alert.setStatus(status);
        if (resolutionNote != null) alert.setResolutionNote(resolutionNote);
        if (handledBy != null) alert.setAssignedTo(handledBy);
        alert.setHandledAt(Instant.now());

        return alertRepository.save(alert);
    }
}
