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
public class MedicalReportResponse {

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private String extractedText;
    private String analysisResult;
    private boolean abnormalValuesFound;
    private String abnormalValuesDetails;
    private String simplifiedExplanation;
    private boolean reviewedByDoctor;
    private LocalDateTime uploadedAt;
}
