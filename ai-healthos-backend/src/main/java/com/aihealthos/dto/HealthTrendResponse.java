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
public class HealthTrendResponse {

    private List<TrendData> bloodPressureTrend;
    private List<TrendData> bloodSugarTrend;
    private List<TrendData> heartRateTrend;
    private List<TrendData> weightTrend;
    private String overallAssessment;
    private List<String> alerts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendData {
        private LocalDateTime timestamp;
        private Double value;
        private String label;
    }
}
