package com.aihealthos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthRecordResponse {

    private Long id;
    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double bloodSugar;
    private Integer heartRate;
    private Double temperature;
    private Double weight;
    private Double height;
    private Integer oxygenSaturation;
    private String notes;
    private LocalDateTime recordedAt;
    private String riskAssessment;
}
