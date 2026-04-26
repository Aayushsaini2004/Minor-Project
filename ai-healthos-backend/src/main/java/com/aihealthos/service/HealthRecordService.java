package com.aihealthos.service;

import com.aihealthos.dto.HealthRecordRequest;
import com.aihealthos.dto.HealthRecordResponse;
import com.aihealthos.dto.HealthTrendResponse;
import com.aihealthos.model.HealthRecord;
import com.aihealthos.model.User;
import com.aihealthos.repository.HealthRecordRepository;
import com.aihealthos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HealthRecordService {

    private static final Logger log = LoggerFactory.getLogger(HealthRecordService.class);

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public HealthRecordResponse createHealthRecord(Long userId, HealthRecordRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        HealthRecord record = new HealthRecord();
        record.setUser(user);
        record.setBloodPressureSystolic(request.getBloodPressureSystolic());
        record.setBloodPressureDiastolic(request.getBloodPressureDiastolic());
        record.setBloodSugar(request.getBloodSugar());
        record.setHeartRate(request.getHeartRate());
        record.setTemperature(request.getTemperature());
        record.setWeight(request.getWeight());
        record.setHeight(request.getHeight());
        record.setOxygenSaturation(request.getOxygenSaturation());
        record.setNotes(request.getNotes());

        HealthRecord savedRecord = healthRecordRepository.save(record);

        log.info("Health record created for user {}: ID {}", userId, savedRecord.getId());

        return convertToResponse(savedRecord);
    }

    @Transactional(readOnly = true)
    public List<HealthRecordResponse> getUserHealthHistory(Long userId) {
        List<HealthRecord> records = healthRecordRepository.findByUserIdOrderByRecordedAtDesc(userId);
        return records.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HealthRecordResponse getHealthRecordById(Long recordId, Long userId) {
        Optional<HealthRecord> recordOpt = healthRecordRepository.findById(recordId);
        
        if (recordOpt.isEmpty()) {
            throw new RuntimeException("Health record not found");
        }

        HealthRecord record = recordOpt.get();
        if (!record.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to health record");
        }

        return convertToResponse(record);
    }

    @Transactional(readOnly = true)
    public HealthTrendResponse getHealthTrends(Long userId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<HealthRecord> records = healthRecordRepository.findRecentRecords(userId, thirtyDaysAgo);

        List<HealthTrendResponse.TrendData> bpTrend = new ArrayList<>();
        List<HealthTrendResponse.TrendData> sugarTrend = new ArrayList<>();
        List<HealthTrendResponse.TrendData> hrTrend = new ArrayList<>();
        List<HealthTrendResponse.TrendData> weightTrend = new ArrayList<>();
        List<String> alerts = new ArrayList<>();

        for (HealthRecord record : records) {
            if (record.getBloodPressureSystolic() != null && record.getBloodPressureDiastolic() != null) {
                bpTrend.add(HealthTrendResponse.TrendData.builder()
                        .timestamp(record.getRecordedAt())
                        .value((double) record.getBloodPressureSystolic())
                        .label(record.getBloodPressureSystolic() + "/" + record.getBloodPressureDiastolic())
                        .build());

                // Check for high BP
                if (record.getBloodPressureSystolic() > 140 || record.getBloodPressureDiastolic() > 90) {
                    alerts.add("High blood pressure detected on " + record.getRecordedAt().toLocalDate());
                }
            }

            if (record.getBloodSugar() != null) {
                sugarTrend.add(HealthTrendResponse.TrendData.builder()
                        .timestamp(record.getRecordedAt())
                        .value(record.getBloodSugar())
                        .build());

                // Check for high blood sugar
                if (record.getBloodSugar() > 140) {
                    alerts.add("High blood sugar detected on " + record.getRecordedAt().toLocalDate());
                }
            }

            if (record.getHeartRate() != null) {
                hrTrend.add(HealthTrendResponse.TrendData.builder()
                        .timestamp(record.getRecordedAt())
                        .value((double) record.getHeartRate())
                        .build());

                // Check for abnormal heart rate
                if (record.getHeartRate() > 100 || record.getHeartRate() < 60) {
                    alerts.add("Abnormal heart rate detected on " + record.getRecordedAt().toLocalDate());
                }
            }

            if (record.getWeight() != null) {
                weightTrend.add(HealthTrendResponse.TrendData.builder()
                        .timestamp(record.getRecordedAt())
                        .value(record.getWeight())
                        .build());
            }
        }

        String overallAssessment = generateOverallAssessment(records, alerts);

        return HealthTrendResponse.builder()
                .bloodPressureTrend(bpTrend)
                .bloodSugarTrend(sugarTrend)
                .heartRateTrend(hrTrend)
                .weightTrend(weightTrend)
                .overallAssessment(overallAssessment)
                .alerts(alerts)
                .build();
    }

    @Transactional
    public void deleteHealthRecord(Long recordId, Long userId) {
        Optional<HealthRecord> recordOpt = healthRecordRepository.findById(recordId);
        
        if (recordOpt.isEmpty()) {
            throw new RuntimeException("Health record not found");
        }

        HealthRecord record = recordOpt.get();
        if (!record.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to health record");
        }

        healthRecordRepository.delete(record);
        log.info("Health record {} deleted for user {}", recordId, userId);
    }

    private HealthRecordResponse convertToResponse(HealthRecord record) {
        String riskAssessment = assessRisk(record);

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
                .riskAssessment(riskAssessment)
                .build();
    }

    private String assessRisk(HealthRecord record) {
        List<String> risks = new ArrayList<>();

        if (record.getBloodPressureSystolic() != null && record.getBloodPressureDiastolic() != null) {
            if (record.getBloodPressureSystolic() > 180 || record.getBloodPressureDiastolic() > 120) {
                risks.add("CRITICAL: Hypertensive Crisis");
            } else if (record.getBloodPressureSystolic() > 140 || record.getBloodPressureDiastolic() > 90) {
                risks.add("HIGH: Stage 2 Hypertension");
            } else if (record.getBloodPressureSystolic() > 130 || record.getBloodPressureDiastolic() > 80) {
                risks.add("MEDIUM: Stage 1 Hypertension");
            }
        }

        if (record.getBloodSugar() != null) {
            if (record.getBloodSugar() > 200) {
                risks.add("HIGH: Very High Blood Sugar");
            } else if (record.getBloodSugar() > 140) {
                risks.add("MEDIUM: Elevated Blood Sugar");
            }
        }

        if (record.getHeartRate() != null) {
            if (record.getHeartRate() > 120 || record.getHeartRate() < 50) {
                risks.add("HIGH: Abnormal Heart Rate");
            } else if (record.getHeartRate() > 100 || record.getHeartRate() < 60) {
                risks.add("MEDIUM: Borderline Heart Rate");
            }
        }

        if (record.getOxygenSaturation() != null && record.getOxygenSaturation() < 90) {
            risks.add("CRITICAL: Low Oxygen Saturation");
        }

        return risks.isEmpty() ? "NORMAL" : String.join(", ", risks);
    }

    private String generateOverallAssessment(List<HealthRecord> records, List<String> alerts) {
        if (records.isEmpty()) {
            return "No health data available for the past 30 days.";
        }

        if (alerts.isEmpty()) {
            return "Your health metrics appear to be within normal ranges. Keep maintaining your healthy lifestyle!";
        } else if (alerts.size() <= 2) {
            return "Some health metrics show minor concerns. Please monitor these values and consult a doctor if they persist.";
        } else {
            return "Multiple health alerts detected. It is recommended to consult a healthcare professional for a comprehensive evaluation.";
        }
    }
}
