package com.aihealthos.dto;

import com.aihealthos.model.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Integer age;
    private String gender;
    private LocalDateTime lastHealthRecordDate;
    private RiskLevel lastRiskLevel;
    private int totalDiagnoses;
    private int pendingReports;
    private List<HealthRecordResponse> recentHealthRecords;
}
