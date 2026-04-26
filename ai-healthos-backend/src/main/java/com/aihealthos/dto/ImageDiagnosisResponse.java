package com.aihealthos.dto;

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
public class ImageDiagnosisResponse {

    private Long id;
    private String imageUrl;
    private String prediction;
    private Double confidenceScore;
    private List<String> possibleConditions;
    private String aiAnalysis;
    private String recommendation;
    private boolean reviewedByDoctor;
    private String doctorNotes;
    private LocalDateTime createdAt;
}
