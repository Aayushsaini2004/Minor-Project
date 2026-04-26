package com.aihealthos.service;

import com.aihealthos.dto.EmergencyCheckRequest;
import com.aihealthos.dto.EmergencyCheckResponse;
import com.aihealthos.dto.AmbulanceDriverResponse;
import com.aihealthos.dto.EmergencyLogResponse;
import com.aihealthos.model.AmbulanceDriver;
import com.aihealthos.model.EmergencyLog;
import com.aihealthos.model.User;
import com.aihealthos.model.enums.RiskLevel;
import com.aihealthos.repository.AmbulanceDriverRepository;
import com.aihealthos.repository.EmergencyLogRepository;
import com.aihealthos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EmergencyService {

    private static final Logger log = LoggerFactory.getLogger(EmergencyService.class);

    @Autowired
    private EmergencyLogRepository emergencyLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AmbulanceDriverRepository ambulanceDriverRepository;

    // Critical symptoms that trigger immediate alerts
    private static final List<String> CRITICAL_SYMPTOMS = Arrays.asList(
        "chest pain", "heart attack", "stroke", "can't breathe", "unconscious",
        "severe bleeding", "seizure", "anaphylaxis", "allergic reaction",
        "suicide", "overdose", "poisoning", "paralysis", "severe burn"
    );

    // High-risk symptoms
    private static final List<String> HIGH_RISK_SYMPTOMS = Arrays.asList(
        "difficulty breathing", "shortness of breath", "severe headache",
        "high fever", "persistent vomiting", "severe abdominal pain",
        "confusion", "slurred speech", "vision loss", "severe dizziness"
    );

    @Transactional
    public EmergencyCheckResponse checkEmergency(Long userId, EmergencyCheckRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();
        String symptoms = request.getSymptoms().toLowerCase();

        // Determine risk level
        RiskLevel riskLevel = assessRiskLevel(symptoms);
        boolean alertTriggered = (riskLevel == RiskLevel.HIGH || riskLevel == RiskLevel.CRITICAL);
        String emergencyType = determineEmergencyType(symptoms);

        // Create emergency log
        EmergencyLog emergencyLog = new EmergencyLog();
        emergencyLog.setUser(user);
        emergencyLog.setSymptoms(request.getSymptoms());
        emergencyLog.setRiskLevel(riskLevel);
        emergencyLog.setAlertTriggered(alertTriggered);
        emergencyLog.setEmergencyType(emergencyType);
        emergencyLog.setLocation(request.getLocation());
        emergencyLog.setEmergencyContactPhone(request.getEmergencyContactPhone());
        emergencyLog.setUserLatitude(request.getLatitude());
        emergencyLog.setUserLongitude(request.getLongitude());
        emergencyLog.setResolved(false);

        if (alertTriggered) {
            emergencyLog.setAlertMessage(generateAlertMessage(riskLevel, emergencyType));
            // Assign nearest ambulance driver if location is provided
            if (request.getLatitude() != null && request.getLongitude() != null) {
                assignNearestDriver(emergencyLog, request.getLatitude(), request.getLongitude(), request.getCity());
            }
            log.warn("EMERGENCY ALERT triggered for user {}: {}", userId, emergencyType);
        }

        EmergencyLog savedLog = emergencyLogRepository.save(emergencyLog);

        return EmergencyCheckResponse.builder()
                .emergencyLogId(savedLog.getId())
                .riskLevel(riskLevel)
                .alertTriggered(alertTriggered)
                .alertMessage(savedLog.getAlertMessage())
                .emergencyType(emergencyType)
                .recommendation(generateRecommendation(riskLevel))
                .requiresImmediateAttention(alertTriggered)
                .checkedAt(savedLog.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<EmergencyLogResponse> getUserEmergencyHistory(Long userId) {
        List<EmergencyLog> logs = emergencyLogRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EmergencyLogResponse> getActiveEmergencies() {
        List<EmergencyLog> logs = emergencyLogRepository.findActiveEmergencies();
        return logs.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getActiveEmergencyCount() {
        return emergencyLogRepository.countByAlertTriggeredAndResolvedFalse();
    }

    @Transactional
    public void resolveEmergency(Long emergencyId, String resolutionNotes) {
        Optional<EmergencyLog> logOpt = emergencyLogRepository.findById(emergencyId);
        
        if (logOpt.isEmpty()) {
            throw new RuntimeException("Emergency log not found");
        }

        EmergencyLog emergencyLog = logOpt.get();
        emergencyLog.setResolved(true);
        emergencyLog.setResolutionNotes(resolutionNotes);
        emergencyLog.setResolvedAt(LocalDateTime.now());
        
        emergencyLogRepository.save(emergencyLog);
        log.info("Emergency {} resolved", emergencyId);
    }

    @Transactional
    public void assignDriverToEmergency(Long emergencyId, Long driverId) {
        Optional<EmergencyLog> logOpt = emergencyLogRepository.findById(emergencyId);
        Optional<AmbulanceDriver> driverOpt = ambulanceDriverRepository.findById(driverId);
        
        if (logOpt.isEmpty()) {
            throw new RuntimeException("Emergency log not found");
        }
        
        if (driverOpt.isEmpty()) {
            throw new RuntimeException("Driver not found");
        }

        EmergencyLog emergencyLog = logOpt.get();
        AmbulanceDriver driver = driverOpt.get();
        
        emergencyLog.setAssignedDriver(driver);
        emergencyLog.setDriverAssignedAt(LocalDateTime.now());
        emergencyLog.setDriverStatus("PENDING");
        
        // Calculate ETA if user location is available
        if (emergencyLog.getUserLatitude() != null && emergencyLog.getUserLongitude() != null 
            && driver.getLatitude() != null && driver.getLongitude() != null) {
            double distance = calculateDistance(emergencyLog.getUserLatitude(), 
                emergencyLog.getUserLongitude(), driver.getLatitude(), driver.getLongitude());
            int etaMinutes = (int) ((distance / 30.0) * 60);
            emergencyLog.setEstimatedArrivalTime(LocalDateTime.now().plusMinutes(etaMinutes));
        }
        
        emergencyLogRepository.save(emergencyLog);
        log.info("Driver {} assigned to emergency {}", driver.getFullName(), emergencyId);
    }

    @Transactional
    public void updateDriverStatus(Long emergencyId, String status) {
        Optional<EmergencyLog> logOpt = emergencyLogRepository.findById(emergencyId);
        
        if (logOpt.isEmpty()) {
            throw new RuntimeException("Emergency log not found");
        }

        EmergencyLog emergencyLog = logOpt.get();
        emergencyLog.setDriverStatus(status);
        
        if ("ARRIVED".equals(status)) {
            emergencyLog.setEstimatedArrivalTime(LocalDateTime.now());
        }
        
        emergencyLogRepository.save(emergencyLog);
        log.info("Driver status updated to {} for emergency {}", status, emergencyId);
    }

    @Transactional(readOnly = true)
    public Object getDriverTrackingInfo(Long emergencyId) {
        Optional<EmergencyLog> logOpt = emergencyLogRepository.findById(emergencyId);
        
        if (logOpt.isEmpty()) {
            throw new RuntimeException("Emergency log not found");
        }

        EmergencyLog emergencyLog = logOpt.get();
        
        if (emergencyLog.getAssignedDriver() == null) {
            throw new RuntimeException("No driver assigned to this emergency");
        }
        
        AmbulanceDriver driver = emergencyLog.getAssignedDriver();
        
        Map<String, Object> result = new HashMap<>();
        result.put("driverId", driver.getId());
        result.put("driverName", driver.getFullName());
        result.put("phoneNumber", driver.getPhoneNumber());
        result.put("ambulanceNumber", driver.getAmbulanceNumber());
        result.put("currentLocation", driver.getCurrentLocation());
        result.put("latitude", driver.getLatitude());
        result.put("longitude", driver.getLongitude());
        result.put("status", emergencyLog.getDriverStatus());
        result.put("estimatedArrivalTime", emergencyLog.getEstimatedArrivalTime());
        result.put("userLatitude", emergencyLog.getUserLatitude());
        result.put("userLongitude", emergencyLog.getUserLongitude());
        result.put("distanceInKm", calculateDistance(
            emergencyLog.getUserLatitude() != null ? emergencyLog.getUserLatitude() : 0,
            emergencyLog.getUserLongitude() != null ? emergencyLog.getUserLongitude() : 0,
            driver.getLatitude() != null ? driver.getLatitude() : 0,
            driver.getLongitude() != null ? driver.getLongitude() : 0
        ));
        
        return result;
    }

    private RiskLevel assessRiskLevel(String symptoms) {
        String lowerSymptoms = symptoms.toLowerCase();
        
        for (String critical : CRITICAL_SYMPTOMS) {
            if (lowerSymptoms.contains(critical)) {
                return RiskLevel.CRITICAL;
            }
        }
        
        for (String highRisk : HIGH_RISK_SYMPTOMS) {
            if (lowerSymptoms.contains(highRisk)) {
                return RiskLevel.HIGH;
            }
        }
        
        // Check for medium risk indicators
        if (lowerSymptoms.contains("pain") || lowerSymptoms.contains("fever") || 
            lowerSymptoms.contains("nausea") || lowerSymptoms.contains("fatigue")) {
            return RiskLevel.MEDIUM;
        }
        
        return RiskLevel.LOW;
    }

    private String determineEmergencyType(String symptoms) {
        String lowerSymptoms = symptoms.toLowerCase();
        
        if (lowerSymptoms.contains("chest") || lowerSymptoms.contains("heart")) {
            return "CARDIAC";
        } else if (lowerSymptoms.contains("breath") || lowerSymptoms.contains("lung")) {
            return "RESPIRATORY";
        } else if (lowerSymptoms.contains("head") || lowerSymptoms.contains("brain") || lowerSymptoms.contains("stroke")) {
            return "NEUROLOGICAL";
        } else if (lowerSymptoms.contains("bleeding") || lowerSymptoms.contains("injury")) {
            return "TRAUMA";
        } else if (lowerSymptoms.contains("allergic") || lowerSymptoms.contains("anaphylaxis")) {
            return "ALLERGIC_REACTION";
        } else if (lowerSymptoms.contains("poison") || lowerSymptoms.contains("overdose")) {
            return "TOXICOLOGY";
        } else if (lowerSymptoms.contains("mental") || lowerSymptoms.contains("suicide")) {
            return "PSYCHIATRIC";
        }
        
        return "GENERAL";
    }

    private String generateAlertMessage(RiskLevel riskLevel, String emergencyType) {
        if (riskLevel == RiskLevel.CRITICAL) {
            return "CRITICAL EMERGENCY: " + emergencyType + " - Immediate medical attention required!";
        } else if (riskLevel == RiskLevel.HIGH) {
            return "HIGH RISK: " + emergencyType + " - Seek medical attention promptly.";
        }
        return null;
    }

    private String generateRecommendation(RiskLevel riskLevel) {
        switch (riskLevel) {
            case CRITICAL:
                return "Call emergency services (911) immediately. Do not drive yourself.";
            case HIGH:
                return "Seek immediate medical attention. Go to the nearest emergency room.";
            case MEDIUM:
                return "Monitor your symptoms closely. Consult a doctor if symptoms worsen.";
            case LOW:
                return "Your symptoms appear mild. Rest and monitor. Consult a doctor if needed.";
            default:
                return "Please consult a healthcare professional for proper evaluation.";
        }
    }

    private EmergencyLogResponse convertToResponse(EmergencyLog log) {
        EmergencyLogResponse response = EmergencyLogResponse.builder()
                .id(log.getId())
                .symptoms(log.getSymptoms())
                .riskLevel(log.getRiskLevel())
                .alertTriggered(log.isAlertTriggered())
                .alertMessage(log.getAlertMessage())
                .emergencyType(log.getEmergencyType())
                .contactedEmergencyContact(log.isContactedEmergencyContact())
                .location(log.getLocation())
                .userLatitude(log.getUserLatitude())
                .userLongitude(log.getUserLongitude())
                .driverStatus(log.getDriverStatus())
                .driverAssignedAt(log.getDriverAssignedAt())
                .estimatedArrivalTime(log.getEstimatedArrivalTime())
                .resolved(log.isResolved())
                .resolutionNotes(log.getResolutionNotes())
                .createdAt(log.getCreatedAt())
                .resolvedAt(log.getResolvedAt())
                .build();
        
        // Include assigned driver info if available
        if (log.getAssignedDriver() != null) {
            AmbulanceDriver driver = log.getAssignedDriver();
            response.setAssignedDriver(AmbulanceDriverResponse.builder()
                    .id(driver.getId())
                    .fullName(driver.getFullName())
                    .phoneNumber(driver.getPhoneNumber())
                    .age(driver.getAge())
                    .ambulanceNumber(driver.getAmbulanceNumber())
                    .currentLocation(driver.getCurrentLocation())
                    .latitude(driver.getLatitude())
                    .longitude(driver.getLongitude())
                    .city(driver.getCity())
                    .available(driver.isAvailable())
                    .active(driver.isActive())
                    .licensePlate(driver.getLicensePlate())
                    .emergencyEquipment(driver.getEmergencyEquipment())
                    .build());
        }
        
        return response;
    }

    private void assignNearestDriver(EmergencyLog emergencyLog, Double userLat, Double userLng, String city) {
        try {
            // Find available drivers in the same city
            List<AmbulanceDriver> drivers = ambulanceDriverRepository.findAvailableDriversByCity(city);
            
            if (drivers.isEmpty()) {
                // If no drivers in city, get all available drivers with location
                drivers = ambulanceDriverRepository.findAvailableDriversWithLocation();
            }
            
            if (drivers.isEmpty()) {
                log.warn("No ambulance drivers available for emergency");
                return;
            }
            
            // Find nearest driver using Haversine formula
            AmbulanceDriver nearestDriver = findNearestDriver(drivers, userLat, userLng);
            
            if (nearestDriver != null) {
                emergencyLog.setAssignedDriver(nearestDriver);
                emergencyLog.setDriverAssignedAt(java.time.LocalDateTime.now());
                emergencyLog.setDriverStatus("PENDING");
                
                // Calculate estimated arrival time (assuming 30 km/h average speed)
                double distance = calculateDistance(userLat, userLng, 
                    nearestDriver.getLatitude(), nearestDriver.getLongitude());
                int etaMinutes = (int) ((distance / 30.0) * 60);
                emergencyLog.setEstimatedArrivalTime(
                    java.time.LocalDateTime.now().plusMinutes(etaMinutes));
                
                log.info("Assigned driver {} to emergency. Distance: {} km, ETA: {} min", 
                    nearestDriver.getFullName(), distance, etaMinutes);
            }
        } catch (Exception e) {
            log.error("Error assigning ambulance driver: {}", e.getMessage());
        }
    }

    private AmbulanceDriver findNearestDriver(List<AmbulanceDriver> drivers, Double userLat, Double userLng) {
        AmbulanceDriver nearestDriver = null;
        double minDistance = Double.MAX_VALUE;
        
        for (AmbulanceDriver driver : drivers) {
            if (driver.getLatitude() != null && driver.getLongitude() != null) {
                double distance = calculateDistance(userLat, userLng, 
                    driver.getLatitude(), driver.getLongitude());
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestDriver = driver;
                }
            }
        }
        
        return nearestDriver;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance in km
    }
}
