package com.aihealthos.dto;

import com.aihealthos.model.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TriageResponse {

    private Long patientId;
    private String patientName;
    private String patientEmail;
    private RiskLevel priorityLevel;
    private String reason;
    private LocalDateTime lastActivity;
    private int totalHighRiskDiagnoses;
    private boolean hasUnreviewedAbnormalReports;
    private int pendingEmergencyAlerts;
}
