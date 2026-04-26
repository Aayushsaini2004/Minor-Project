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
public class EmergencyLogResponse {

    private Long id;
    private String symptoms;
    private RiskLevel riskLevel;
    private boolean alertTriggered;
    private String alertMessage;
    private String emergencyType;
    private boolean contactedEmergencyContact;
    private String location;
    
    private Double userLatitude;
    private Double userLongitude;
    
    private AmbulanceDriverResponse assignedDriver;
    private LocalDateTime driverAssignedAt;
    private String driverStatus;
    private LocalDateTime estimatedArrivalTime;
    
    private boolean resolved;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private UserProfileResponse user;
}
