package com.bbms.backend.Repository;

import com.bbms.backend.entity.Alert;
import com.bbms.backend.entity.AlertStatus;
import com.bbms.backend.entity.AlertType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    // Get all ACTIVE alerts
    List<Alert> findByStatus(AlertStatus status);

    // Get alerts by type
    List<Alert> findByAlertType(AlertType alertType);

    // Check whether an ACTIVE alert with the same message already exists
    boolean existsByMessageAndStatus(String message, AlertStatus status);
    // ✅ Check duplicate expiry alerts
    boolean existsByAlertTypeAndMessage(
            AlertType alertType,
            String message
    );
}
