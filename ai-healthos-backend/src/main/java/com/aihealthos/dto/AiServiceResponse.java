package com.aihealthos.dto;

import java.util.List;

public class AiServiceResponse {

    private String predictedCondition;
    private String riskLevel;
    private Double confidenceScore;
    private String recommendation;
    private List<String> possibleConditions;
    private String analysis;
    private boolean success;
    private String errorMessage;

    public AiServiceResponse() {
    }

    public AiServiceResponse(String predictedCondition, String riskLevel, Double confidenceScore, String recommendation, List<String> possibleConditions, String analysis, boolean success, String errorMessage) {
        this.predictedCondition = predictedCondition;
        this.riskLevel = riskLevel;
        this.confidenceScore = confidenceScore;
        this.recommendation = recommendation;
        this.possibleConditions = possibleConditions;
        this.analysis = analysis;
        this.success = success;
        this.errorMessage = errorMessage;
    }

    public String getPredictedCondition() {
        return predictedCondition;
    }

    public void setPredictedCondition(String predictedCondition) {
        this.predictedCondition = predictedCondition;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
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

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public static AiServiceResponseBuilder builder() {
        return new AiServiceResponseBuilder();
    }

    public static class AiServiceResponseBuilder {
        private String predictedCondition;
        private String riskLevel;
        private Double confidenceScore;
        private String recommendation;
        private List<String> possibleConditions;
        private String analysis;
        private boolean success;
        private String errorMessage;

        public AiServiceResponseBuilder predictedCondition(String predictedCondition) {
            this.predictedCondition = predictedCondition;
            return this;
        }

        public AiServiceResponseBuilder riskLevel(String riskLevel) {
            this.riskLevel = riskLevel;
            return this;
        }

        public AiServiceResponseBuilder confidenceScore(Double confidenceScore) {
            this.confidenceScore = confidenceScore;
            return this;
        }

        public AiServiceResponseBuilder recommendation(String recommendation) {
            this.recommendation = recommendation;
            return this;
        }

        public AiServiceResponseBuilder possibleConditions(List<String> possibleConditions) {
            this.possibleConditions = possibleConditions;
            return this;
        }

        public AiServiceResponseBuilder analysis(String analysis) {
            this.analysis = analysis;
            return this;
        }

        public AiServiceResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public AiServiceResponseBuilder errorMessage(String errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        }

        public AiServiceResponse build() {
            return new AiServiceResponse(predictedCondition, riskLevel, confidenceScore, recommendation, possibleConditions, analysis, success, errorMessage);
        }
    }
}
