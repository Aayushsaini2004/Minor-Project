package com.aihealthos.dto;

import com.aihealthos.model.enums.RiskLevel;

import java.time.LocalDateTime;
import java.util.List;

public class SymptomCheckResponse {

    private Long diagnosisId;
    private String predictedDisease;
    private RiskLevel riskLevel;
    private Double confidenceScore;
    private String recommendation;
    private List<String> possibleConditions;
    private String aiAnalysis;
    private LocalDateTime createdAt;

    public SymptomCheckResponse() {
    }

    public SymptomCheckResponse(Long diagnosisId, String predictedDisease, RiskLevel riskLevel, Double confidenceScore, String recommendation, List<String> possibleConditions, String aiAnalysis, LocalDateTime createdAt) {
        this.diagnosisId = diagnosisId;
        this.predictedDisease = predictedDisease;
        this.riskLevel = riskLevel;
        this.confidenceScore = confidenceScore;
        this.recommendation = recommendation;
        this.possibleConditions = possibleConditions;
        this.aiAnalysis = aiAnalysis;
        this.createdAt = createdAt;
    }

    public Long getDiagnosisId() {
        return diagnosisId;
    }

    public void setDiagnosisId(Long diagnosisId) {
        this.diagnosisId = diagnosisId;
    }

    public String getPredictedDisease() {
        return predictedDisease;
    }

    public void setPredictedDisease(String predictedDisease) {
        this.predictedDisease = predictedDisease;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<String> getPossibleConditions() {
        return possibleConditions;
    }

    public void setPossibleConditions(List<String> possibleConditions) {
        this.possibleConditions = possibleConditions;
    }

    public String getAiAnalysis() {
        return aiAnalysis;
    }

    public void setAiAnalysis(String aiAnalysis) {
        this.aiAnalysis = aiAnalysis;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static SymptomCheckResponseBuilder builder() {
        return new SymptomCheckResponseBuilder();
    }

    public static class SymptomCheckResponseBuilder {
        private Long diagnosisId;
        private String predictedDisease;
        private RiskLevel riskLevel;
        private Double confidenceScore;
        private String recommendation;
        private List<String> possibleConditions;
        private String aiAnalysis;
        private LocalDateTime createdAt;

        public SymptomCheckResponseBuilder diagnosisId(Long diagnosisId) {
            this.diagnosisId = diagnosisId;
            return this;
        }

        public SymptomCheckResponseBuilder predictedDisease(String predictedDisease) {
            this.predictedDisease = predictedDisease;
            return this;
        }

        public SymptomCheckResponseBuilder riskLevel(RiskLevel riskLevel) {
            this.riskLevel = riskLevel;
            return this;
        }

        public SymptomCheckResponseBuilder confidenceScore(Double confidenceScore) {
            this.confidenceScore = confidenceScore;
            return this;
        }

        public SymptomCheckResponseBuilder recommendation(String recommendation) {
            this.recommendation = recommendation;
            return this;
        }

        public SymptomCheckResponseBuilder possibleConditions(List<String> possibleConditions) {
            this.possibleConditions = possibleConditions;
            return this;
        }

        public SymptomCheckResponseBuilder aiAnalysis(String aiAnalysis) {
            this.aiAnalysis = aiAnalysis;
            return this;
        }

        public SymptomCheckResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public SymptomCheckResponse build() {
            return new SymptomCheckResponse(diagnosisId, predictedDisease, riskLevel, confidenceScore, recommendation, possibleConditions, aiAnalysis, createdAt);
        }
    }
}
