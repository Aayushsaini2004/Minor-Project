package com.aihealthos.controller;

import com.aihealthos.dto.HealthRecordRequest;
import com.aihealthos.dto.HealthRecordResponse;
import com.aihealthos.dto.HealthTrendResponse;
import com.aihealthos.dto.MessageResponse;
import com.aihealthos.model.HealthRecord;
import com.aihealthos.model.User;
import com.aihealthos.repository.HealthRecordRepository;
import com.aihealthos.repository.UserRepository;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.HealthRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Monitoring", description = "Health record and monitoring APIs")
@SecurityRequirement(name = "bearerAuth")
public class HealthRecordController {

    private static final Logger log = LoggerFactory.getLogger(HealthRecordController.class);

    @Autowired
    private HealthRecordService healthRecordService;

    @Autowired
    private HealthRecordRepository healthRecordRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/all-patients")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get all patients health records", description = "Doctor views all patients health records with patient name")
    public ResponseEntity<?> getAllPatientsHealthRecords() {
        try {
            List<HealthRecord> allRecords = healthRecordRepository.findAll();
            List<Map<String, Object>> result = allRecords.stream().map(record -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", record.getId());
                item.put("patientName", record.getUser().getFullName() != null ? record.getUser().getFullName() : record.getUser().getUsername());
                item.put("patientUsername", record.getUser().getUsername());
                item.put("bloodPressureSystolic", record.getBloodPressureSystolic());
                item.put("bloodPressureDiastolic", record.getBloodPressureDiastolic());
                item.put("bloodSugar", record.getBloodSugar());
                item.put("heartRate", record.getHeartRate());
                item.put("temperature", record.getTemperature());
                item.put("weight", record.getWeight());
                item.put("height", record.getHeight());
                item.put("oxygenSaturation", record.getOxygenSaturation());
                item.put("notes", record.getNotes());
                item.put("recordedAt", record.getRecordedAt());
                return item;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching all patients health records: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @PostMapping("/record")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Create health record", description = "Record new health data (BP, Sugar, Heart Rate, etc.)")
    public ResponseEntity<?> createHealthRecord(@Valid @RequestBody HealthRecordRequest request,
                                               Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            HealthRecordResponse response = healthRecordService.createHealthRecord(userDetails.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating health record: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error creating health record: " + e.getMessage(), false));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get health history", description = "Get user's health records history")
    public ResponseEntity<?> getHealthHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            List<HealthRecordResponse> history = healthRecordService.getUserHealthHistory(userDetails.getId());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching health history: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching history: " + e.getMessage(), false));
        }
    }

    @GetMapping("/record/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get health record by ID", description = "Get specific health record details")
    public ResponseEntity<?> getHealthRecordById(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            HealthRecordResponse response = healthRecordService.getHealthRecordById(id, userDetails.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching health record: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching record: " + e.getMessage(), false));
        }
    }

    @GetMapping("/trends")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get health trends", description = "Get health trends and analysis for the past 30 days")
    public ResponseEntity<?> getHealthTrends(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            HealthTrendResponse trends = healthRecordService.getHealthTrends(userDetails.getId());
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            log.error("Error fetching health trends: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching trends: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/record/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Delete health record", description = "Delete a specific health record")
    public ResponseEntity<?> deleteHealthRecord(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            healthRecordService.deleteHealthRecord(id, userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Health record deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting health record: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error deleting record: " + e.getMessage(), false));
        }
    }
}
