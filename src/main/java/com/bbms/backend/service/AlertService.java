package com.bbms.backend.service;

import com.bbms.backend.Repository.AlertRepository;
import com.bbms.backend.Repository.BloodComponentRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.bbms.backend.entity.*;
import org.springframework.stereotype.Service;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final BloodComponentRepository componentRepository;
    public AlertService(AlertRepository alertRepository,
                        BloodComponentRepository componentRepository) {

        this.alertRepository = alertRepository;
        this.componentRepository = componentRepository;
    }

    // ================= LOW STOCK ALERT =================
    public void createLowStockAlert(String bloodGroup,
                                    BloodComponent.ComponentType componentType,
                                    Double quantity) {

        String message =
                bloodGroup + " " + componentType +
                        " stock is low (" + quantity + " units remaining).";

        // Prevent duplicate ACTIVE alerts
        if (alertRepository.existsByMessageAndStatus(
                message,
                AlertStatus.ACTIVE)) {
            return;
        }

        Alert alert = new Alert();

        alert.setAlertType(AlertType.LOW_STOCK);
        alert.setSeverity(AlertSeverity.HIGH);
        alert.setMessage(message);

        alertRepository.save(alert);
    }

    // ================= CHECK EXPIRY ALERTS =================
    public void checkExpiryAlerts() {

        LocalDate today = LocalDate.now();

        componentRepository.findAll().forEach(component -> {

            if (component.getExpiryDate() == null) {
                return;
            }

            long daysRemaining =
                    ChronoUnit.DAYS.between(today, component.getExpiryDate());

            // Create alert if expiry is within 3 days
            if (daysRemaining >= 0 && daysRemaining <= 7) {

                String message =
                        component.getBloodGroup() + " "
                                + component.getComponentType()
                                + " (Component #" + component.getComponentId()
                                + ") expires in "
                                + daysRemaining + " day(s).";

                if (!alertRepository.existsByAlertTypeAndMessage(
                        AlertType.EXPIRY_WARNING,
                        message)) {

                    Alert alert = new Alert();

                    alert.setAlertType(AlertType.EXPIRY_WARNING);
                    alert.setSeverity(AlertSeverity.MEDIUM);
                    alert.setMessage(message);

                    alertRepository.save(alert);
                }
            }
        });
    }

    // ================= EMERGENCY REQUEST =================
    public void createEmergencyAlert(String hospitalName,
                                     String bloodGroup) {

        String message =
                "Emergency blood request from " +
                        hospitalName +
                        " for " +
                        bloodGroup;

        if (alertRepository.existsByMessageAndStatus(
                message,
                AlertStatus.ACTIVE)) {
            return;
        }

        Alert alert = new Alert();

        alert.setAlertType(AlertType.EMERGENCY_REQUEST);
        alert.setSeverity(AlertSeverity.CRITICAL);
        alert.setMessage(message);

        alertRepository.save(alert);
    }

}
