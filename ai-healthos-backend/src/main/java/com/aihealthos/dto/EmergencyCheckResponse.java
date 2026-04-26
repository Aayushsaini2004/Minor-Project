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
public class EmergencyCheckResponse {

    private Long emergencyLogId;
    private RiskLevel riskLevel;
    private boolean alertTriggered;
    private String alertMessage;
    private String emergencyType;
    private String recommendation;
    private boolean requiresImmediateAttention;
    private LocalDateTime checkedAt;
}
