package com.aihealthos.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HealthRecordRequest {

    private Integer bloodPressureSystolic;
    private Integer bloodPressureDiastolic;
    private Double bloodSugar;
    private Integer heartRate;
    private Double temperature;
    private Double weight;
    private Double height;
    private Integer oxygenSaturation;
    private String notes;
}
