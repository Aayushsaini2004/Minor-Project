package com.aihealthos.controller;

import com.aihealthos.dto.MessageResponse;
import com.aihealthos.dto.SymptomCheckRequest;
import com.aihealthos.dto.SymptomCheckResponse;
import com.aihealthos.model.enums.UserRole;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.DiagnosisService;
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

import java.util.List;

@RestController
@RequestMapping("/api/diagnosis")
@Tag(name = "AI Diagnosis", description = "AI-powered symptom checking and diagnosis APIs")
@SecurityRequirement(name = "bearerAuth")
public class DiagnosisController {

    private static final Logger log = LoggerFactory.getLogger(DiagnosisController.class);

    @Autowired
    private DiagnosisService diagnosisService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Check symptoms", description = "Analyze symptoms using AI and get diagnosis")
    public ResponseEntity<?> checkSymptoms(@Valid @RequestBody SymptomCheckRequest request,
                                          Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            SymptomCheckResponse response = diagnosisService.analyzeSymptoms(userDetails.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error analyzing symptoms: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error analyzing symptoms: " + e.getMessage(), false));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get diagnosis history", description = "Get user's diagnosis history")
    public ResponseEntity<?> getDiagnosisHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            List<SymptomCheckResponse> history = diagnosisService.getUserDiagnosisHistory(userDetails.getId());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching diagnosis history: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching history: " + e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get diagnosis by ID", description = "Get specific diagnosis report details")
    public ResponseEntity<?> getDiagnosisById(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            SymptomCheckResponse response = diagnosisService.getDiagnosisById(id, userDetails.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching diagnosis: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching diagnosis: " + e.getMessage(), false));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get all diagnoses", description = "Get all diagnosis reports (Doctor/Admin only)")
    public ResponseEntity<?> getAllDiagnoses() {
        try {
            List<SymptomCheckResponse> diagnoses = diagnosisService.getAllDiagnosisReports();
            return ResponseEntity.ok(diagnoses);
        } catch (Exception e) {
            log.error("Error fetching all diagnoses: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching diagnoses: " + e.getMessage(), false));
        }
    }

    @GetMapping("/high-risk")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get high-risk diagnoses", description = "Get high and critical risk diagnoses (Doctor/Admin only)")
    public ResponseEntity<?> getHighRiskDiagnoses() {
        try {
            List<SymptomCheckResponse> diagnoses = diagnosisService.getHighRiskDiagnoses();
            return ResponseEntity.ok(diagnoses);
        } catch (Exception e) {
            log.error("Error fetching high-risk diagnoses: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching high-risk diagnoses: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Mark diagnosis as reviewed", description = "Doctor reviews and adds notes to diagnosis")
    public ResponseEntity<?> markAsReviewed(@PathVariable Long id,
                                           @RequestParam(required = false) String doctorNotes) {
        try {
            diagnosisService.markAsReviewed(id, doctorNotes);
            return ResponseEntity.ok(new MessageResponse("Diagnosis marked as reviewed successfully"));
        } catch (Exception e) {
            log.error("Error marking diagnosis as reviewed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }
}
