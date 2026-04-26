package com.aihealthos.model;

import com.aihealthos.model.enums.RiskLevel;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnosis_reports")
public class DiagnosisReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "symptoms", length = 2000, nullable = false)
    private String symptoms;

    @Column(name = "predicted_disease")
    private String predictedDisease;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level")
    private RiskLevel riskLevel;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "recommendation", length = 2000)
    private String recommendation;

    @Column(name = "possible_conditions", length = 1000)
    private String possibleConditions;

    @Column(name = "ai_service_response", length = 3000)
    private String aiServiceResponse;

    @Column(name = "reviewed_by_doctor")
    private boolean reviewedByDoctor = false;

    @Column(name = "doctor_notes", length = 1000)
    private String doctorNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public DiagnosisReport() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
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

    public String getPossibleConditions() {
        return possibleConditions;
    }

    public void setPossibleConditions(String possibleConditions) {
        this.possibleConditions = possibleConditions;
    }

    public String getAiServiceResponse() {
        return aiServiceResponse;
    }

    public void setAiServiceResponse(String aiServiceResponse) {
        this.aiServiceResponse = aiServiceResponse;
    }

    public boolean isReviewedByDoctor() {
        return reviewedByDoctor;
    }

    public void setReviewedByDoctor(boolean reviewedByDoctor) {
        this.reviewedByDoctor = reviewedByDoctor;
    }

    public String getDoctorNotes() {
        return doctorNotes;
    }

    public void setDoctorNotes(String doctorNotes) {
        this.doctorNotes = doctorNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
