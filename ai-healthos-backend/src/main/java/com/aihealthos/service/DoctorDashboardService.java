package com.aihealthos.service;

import com.aihealthos.dto.*;
import com.aihealthos.model.*;
import com.aihealthos.model.enums.RiskLevel;
import com.aihealthos.model.enums.UserRole;
import com.aihealthos.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorDashboardService {

    private static final Logger log = LoggerFactory.getLogger(DoctorDashboardService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private DiagnosisReportRepository diagnosisReportRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @Transactional(readOnly = true)
    public List<PatientResponse> getAllPatients() {
        List<User> patients = userRepository.findByRole(UserRole.USER);
        
        return patients.stream()
                .map(this::convertToPatientResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PatientResponse getPatientDetails(Long patientId) {
        Optional<User> patientOpt = userRepository.findById(patientId);
        if (patientOpt.isEmpty()) {
            throw new RuntimeException("Patient not found");
        }

        return convertToPatientResponseWithRecords(patientOpt.get());
    }

    @Transactional(readOnly = true)
    public List<TriageResponse> getTriageList() {
        List<User> patients = userRepository.findByRole(UserRole.USER);
        List<TriageResponse> triageList = new ArrayList<>();

        for (User patient : patients) {
            TriageResponse triage = assessPatientPriority(patient);
            if (triage != null) {
                triageList.add(triage);
            }
        }

        // Sort by priority level (CRITICAL > HIGH > MEDIUM > LOW)
        return triageList.stream()
                .sorted(Comparator.comparing(TriageResponse::getPriorityLevel, 
                        Comparator.comparingInt(this::getRiskLevelPriority)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalPatients = userRepository.count();
        long activeEmergencies = emergencyLogRepository.countByAlertTriggeredAndResolvedFalse();
        long unreviewedHighRiskDiagnoses = diagnosisReportRepository.countByRiskLevelAndReviewedByDoctorFalse(RiskLevel.HIGH)
                + diagnosisReportRepository.countByRiskLevelAndReviewedByDoctorFalse(RiskLevel.CRITICAL);
        long unreviewedAbnormalReports = medicalReportRepository.findByAbnormalValuesFound(true).stream()
                .filter(r -> !r.isReviewedByDoctor()).count();

        return DashboardStatsResponse.builder()
                .totalPatients(totalPatients)
                .activeEmergencies(activeEmergencies)
                .unreviewedHighRiskDiagnoses(unreviewedHighRiskDiagnoses)
                .unreviewedAbnormalReports(unreviewedAbnormalReports)
                .build();
    }

    private PatientResponse convertToPatientResponse(User user) {
        // Get latest health record
        List<HealthRecord> records = healthRecordRepository.findByUserIdOrderByRecordedAtDesc(user.getId());
        LocalDateTime lastRecordDate = records.isEmpty() ? null : records.get(0).getRecordedAt();

        // Get latest diagnosis risk level
        List<DiagnosisReport> diagnoses = diagnosisReportRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        RiskLevel lastRiskLevel = diagnoses.isEmpty() ? null : diagnoses.get(0).getRiskLevel();

        // Count pending reports
        int pendingReports = (int) medicalReportRepository.findByUserIdOrderByUploadedAtDesc(user.getId()).stream()
                .filter(r -> !r.isReviewedByDoctor()).count();

        return PatientResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .age(user.getAge())
                .gender(user.getGender())
                .lastHealthRecordDate(lastRecordDate)
                .lastRiskLevel(lastRiskLevel)
                .totalDiagnoses(diagnoses.size())
                .pendingReports(pendingReports)
                .build();
    }

    private PatientResponse convertToPatientResponseWithRecords(User user) {
        PatientResponse response = convertToPatientResponse(user);
        
        // Add recent health records
        List<HealthRecord> recentRecords = healthRecordRepository.findByUserIdOrderByRecordedAtDesc(user.getId());
        List<HealthRecordResponse> recordResponses = recentRecords.stream()
                .limit(5)
                .map(this::convertToHealthRecordResponse)
                .collect(Collectors.toList());
        
        response.setRecentHealthRecords(recordResponses);
        return response;
    }

    private HealthRecordResponse convertToHealthRecordResponse(HealthRecord record) {
        return HealthRecordResponse.builder()
                .id(record.getId())
                .bloodPressureSystolic(record.getBloodPressureSystolic())
                .bloodPressureDiastolic(record.getBloodPressureDiastolic())
                .bloodSugar(record.getBloodSugar())
                .heartRate(record.getHeartRate())
                .temperature(record.getTemperature())
                .weight(record.getWeight())
                .height(record.getHeight())
                .oxygenSaturation(record.getOxygenSaturation())
                .notes(record.getNotes())
                .recordedAt(record.getRecordedAt())
                .build();
    }

    private TriageResponse assessPatientPriority(User patient) {
        List<DiagnosisReport> recentDiagnoses = diagnosisReportRepository.findRecentByUserId(
                patient.getId(), LocalDateTime.now().minusDays(30));
        
        List<MedicalReport> abnormalReports = medicalReportRepository.findAbnormalReportsByUserId(patient.getId());
        List<EmergencyLog> recentEmergencies = emergencyLogRepository.findRecentByUserId(
                patient.getId(), LocalDateTime.now().minusDays(7));

        // Count high risk diagnoses
        long highRiskCount = recentDiagnoses.stream()
                .filter(d -> d.getRiskLevel() == RiskLevel.HIGH || d.getRiskLevel() == RiskLevel.CRITICAL)
                .count();

        // Count unreviewed abnormal reports
        long unreviewedAbnormalCount = abnormalReports.stream()
                .filter(r -> !r.isReviewedByDoctor())
                .count();

        // Count pending emergency alerts
        long pendingEmergencies = recentEmergencies.stream()
                .filter(e -> !e.isResolved())
                .count();

        // Determine priority level
        RiskLevel priorityLevel = RiskLevel.LOW;
        String reason = "";

        if (pendingEmergencies > 0) {
            priorityLevel = RiskLevel.CRITICAL;
            reason = "Active emergency alert";
        } else if (highRiskCount > 0) {
            priorityLevel = RiskLevel.HIGH;
            reason = "Recent high-risk diagnosis";
        } else if (unreviewedAbnormalCount > 0) {
            priorityLevel = RiskLevel.MEDIUM;
            reason = "Unreviewed abnormal lab results";
        } else if (recentDiagnoses.isEmpty() && abnormalReports.isEmpty()) {
            return null; // Skip patients with no recent activity
        }

        // Get last activity date
        LocalDateTime lastActivity = recentDiagnoses.isEmpty() ? 
                (abnormalReports.isEmpty() ? patient.getCreatedAt() : abnormalReports.get(0).getUploadedAt())
                : recentDiagnoses.get(0).getCreatedAt();

        return TriageResponse.builder()
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .patientEmail(patient.getEmail())
                .priorityLevel(priorityLevel)
                .reason(reason)
                .lastActivity(lastActivity)
                .totalHighRiskDiagnoses((int) highRiskCount)
                .hasUnreviewedAbnormalReports(unreviewedAbnormalCount > 0)
                .pendingEmergencyAlerts((int) pendingEmergencies)
                .build();
    }

    private int getRiskLevelPriority(RiskLevel level) {
        return switch (level) {
            case CRITICAL -> 0;
            case HIGH -> 1;
            case MEDIUM -> 2;
            case LOW -> 3;
        };
    }
}
