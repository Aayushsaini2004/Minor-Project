package com.aihealthos.service;

import com.aihealthos.dto.*;
import com.aihealthos.model.DiagnosisReport;
import com.aihealthos.model.User;
import com.aihealthos.model.enums.RiskLevel;
import com.aihealthos.repository.DiagnosisReportRepository;
import com.aihealthos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiagnosisService {

    private static final Logger log = LoggerFactory.getLogger(DiagnosisService.class);

    @Autowired
    private DiagnosisReportRepository diagnosisReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiServiceClient aiServiceClient;

    @Transactional
    public SymptomCheckResponse analyzeSymptoms(Long userId, SymptomCheckRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        // Prepare AI service request
        AiServiceRequest aiRequest = AiServiceRequest.builder()
                .symptoms(request.getSymptoms())
                .age(request.getAge() != null ? request.getAge() : user.getAge())
                .gender(request.getGender() != null ? request.getGender() : user.getGender())
                .additionalNotes(request.getAdditionalNotes())
                .build();

        // Call AI service
        AiServiceResponse aiResponse = aiServiceClient.analyzeSymptoms(aiRequest);

        // Create and save diagnosis report
        DiagnosisReport report = new DiagnosisReport();
        report.setUser(user);
        report.setSymptoms(request.getSymptoms());
        report.setPredictedDisease(aiResponse.getPredictedCondition());
        report.setRiskLevel(RiskLevel.valueOf(aiResponse.getRiskLevel().toUpperCase()));
        report.setConfidenceScore(aiResponse.getConfidenceScore());
        report.setRecommendation(aiResponse.getRecommendation());
        
        if (aiResponse.getPossibleConditions() != null) {
            report.setPossibleConditions(String.join(", ", aiResponse.getPossibleConditions()));
        }
        
        report.setAiServiceResponse(aiResponse.getAnalysis());
        report.setReviewedByDoctor(false);

        DiagnosisReport savedReport = diagnosisReportRepository.save(report);

        log.info("Diagnosis report created for user {}: {}", userId, savedReport.getPredictedDisease());

        return SymptomCheckResponse.builder()
                .diagnosisId(savedReport.getId())
                .predictedDisease(savedReport.getPredictedDisease())
                .riskLevel(savedReport.getRiskLevel())
                .confidenceScore(savedReport.getConfidenceScore())
                .recommendation(savedReport.getRecommendation())
                .possibleConditions(aiResponse.getPossibleConditions())
                .aiAnalysis(savedReport.getAiServiceResponse())
                .createdAt(savedReport.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<SymptomCheckResponse> getUserDiagnosisHistory(Long userId) {
        List<DiagnosisReport> reports = diagnosisReportRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return reports.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SymptomCheckResponse getDiagnosisById(Long diagnosisId, Long userId) {
        Optional<DiagnosisReport> reportOpt = diagnosisReportRepository.findById(diagnosisId);
        
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Diagnosis report not found");
        }

        DiagnosisReport report = reportOpt.get();
        
        // Check if user owns this report or is a doctor/admin
        if (!report.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to diagnosis report");
        }

        return convertToResponse(report);
    }

    @Transactional(readOnly = true)
    public List<SymptomCheckResponse> getAllDiagnosisReports() {
        List<DiagnosisReport> reports = diagnosisReportRepository.findAll();
        
        return reports.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SymptomCheckResponse> getHighRiskDiagnoses() {
        List<RiskLevel> highRiskLevels = Arrays.asList(RiskLevel.HIGH, RiskLevel.CRITICAL);
        List<DiagnosisReport> reports = diagnosisReportRepository.findByRiskLevelsOrderByCreatedAtDesc(highRiskLevels);
        
        return reports.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreviewedHighRiskCount() {
        return diagnosisReportRepository.countByRiskLevelAndReviewedByDoctorFalse(RiskLevel.HIGH)
                + diagnosisReportRepository.countByRiskLevelAndReviewedByDoctorFalse(RiskLevel.CRITICAL);
    }

    @Transactional
    public void markAsReviewed(Long diagnosisId, String doctorNotes) {
        Optional<DiagnosisReport> reportOpt = diagnosisReportRepository.findById(diagnosisId);
        
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Diagnosis report not found");
        }

        DiagnosisReport report = reportOpt.get();
        report.setReviewedByDoctor(true);
        report.setDoctorNotes(doctorNotes);
        
        diagnosisReportRepository.save(report);
        log.info("Diagnosis report {} marked as reviewed", diagnosisId);
    }

    private SymptomCheckResponse convertToResponse(DiagnosisReport report) {
        List<String> possibleConditions = null;
        if (report.getPossibleConditions() != null && !report.getPossibleConditions().isEmpty()) {
            possibleConditions = Arrays.asList(report.getPossibleConditions().split(", "));
        }

        return SymptomCheckResponse.builder()
                .diagnosisId(report.getId())
                .predictedDisease(report.getPredictedDisease())
                .riskLevel(report.getRiskLevel())
                .confidenceScore(report.getConfidenceScore())
                .recommendation(report.getRecommendation())
                .possibleConditions(possibleConditions)
                .aiAnalysis(report.getAiServiceResponse())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
