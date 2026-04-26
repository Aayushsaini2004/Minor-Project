package com.aihealthos.controller;

import com.aihealthos.dto.DashboardStatsResponse;
import com.aihealthos.dto.MessageResponse;
import com.aihealthos.dto.PatientResponse;
import com.aihealthos.dto.RegisterRequest;
import com.aihealthos.dto.TriageResponse;
import com.aihealthos.model.User;
import com.aihealthos.model.enums.UserRole;
import com.aihealthos.repository.UserRepository;
import com.aihealthos.service.DoctorDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@Tag(name = "Doctor Dashboard", description = "Doctor dashboard and patient management APIs")
@SecurityRequirement(name = "bearerAuth")
public class DoctorDashboardController {

    private static final Logger log = LoggerFactory.getLogger(DoctorDashboardController.class);

    @Autowired
    private DoctorDashboardService doctorDashboardService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/patients")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get all patients", description = "Get list of all patients")
    public ResponseEntity<?> getAllPatients() {
        try {
            List<PatientResponse> patients = doctorDashboardService.getAllPatients();
            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            log.error("Error fetching patients: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching patients: " + e.getMessage(), false));
        }
    }

    @GetMapping("/patients/{id}")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get patient details", description = "Get detailed information about a specific patient")
    public ResponseEntity<?> getPatientDetails(@PathVariable Long id) {
        try {
            PatientResponse patient = doctorDashboardService.getPatientDetails(id);
            return ResponseEntity.ok(patient);
        } catch (Exception e) {
            log.error("Error fetching patient details: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching patient: " + e.getMessage(), false));
        }
    }

    @GetMapping("/triage")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get triage list", description = "Get prioritized list of patients needing attention")
    public ResponseEntity<?> getTriageList() {
        try {
            List<TriageResponse> triage = doctorDashboardService.getTriageList();
            return ResponseEntity.ok(triage);
        } catch (Exception e) {
            log.error("Error fetching triage list: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching triage: " + e.getMessage(), false));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get dashboard stats", description = "Get dashboard statistics for doctor")
    public ResponseEntity<?> getDashboardStats() {
        try {
            DashboardStatsResponse stats = doctorDashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching stats: " + e.getMessage(), false));
        }
    }

    @PostMapping("/patients")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Add new patient", description = "Add a new patient (only DOCTOR and ADMIN can add patients)")
    public ResponseEntity<?> addPatient(@Valid @RequestBody RegisterRequest patientRequest) {
        try {
            // Check if username already exists
            if (userRepository.existsByUsername(patientRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Username is already taken!", false));
            }

            // Check if email already exists
            if (userRepository.existsByEmail(patientRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email is already in use!", false));
            }

            // Create new patient (always USER role)
            User patient = new User();
            patient.setUsername(patientRequest.getUsername());
            patient.setEmail(patientRequest.getEmail());
            patient.setPassword(passwordEncoder.encode(patientRequest.getPassword()));
            patient.setFullName(patientRequest.getFullName());
            patient.setPhoneNumber(patientRequest.getPhoneNumber());
            patient.setAge(patientRequest.getAge());
            patient.setGender(patientRequest.getGender());
            patient.setRole(UserRole.USER); // Patients are always USER role
            patient.setActive(true);

            userRepository.save(patient);

            log.info("New patient added: {}", patient.getUsername());

            return ResponseEntity.ok(new MessageResponse("Patient added successfully!", true));
        } catch (Exception e) {
            log.error("Error adding patient: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error adding patient: " + e.getMessage(), false));
        }
    }
}
