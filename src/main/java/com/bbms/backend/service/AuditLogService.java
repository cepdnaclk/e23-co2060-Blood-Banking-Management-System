package com.bbms.backend.service;

import com.bbms.backend.Repository.AuditLogRepository;
import com.bbms.backend.Repository.UserRepository;
import com.bbms.backend.entity.AuditLog;
import com.bbms.backend.entity.User;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository,
            UserRepository userRepository) {

        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void log(
            String action,
            String entityType,
            Long entityId,
            String description) {

        AuditLog auditLog = new AuditLog();

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication != null
                && authentication.isAuthenticated()
                && authentication.getName() != null) {

            String email = authentication.getName();

            userRepository.findByEmail(email)
                    .ifPresent(user ->
                            auditLog.setUserId(
                                    user.getUserId()
                            )
                    );
        }

        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);

        auditLogRepository.save(auditLog);
    }
}