package com.aihealthos.controller;

import com.aihealthos.model.Appointment;
import com.aihealthos.model.User;
import com.aihealthos.model.enums.UserRole;
import com.aihealthos.repository.AppointmentRepository;
import com.aihealthos.repository.UserRepository;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointments", description = "Consultation appointment management")
public class AppointmentController {

    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // ── GET all registered DOCTOR users ─────────────────────────────────────
    @GetMapping("/doctors")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get all available doctors")
    public ResponseEntity<?> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(UserRole.DOCTOR);
        List<Map<String, Object>> result = doctors.stream().map(d -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", d.getId());
            m.put("fullName", d.getFullName() != null ? "Dr. " + d.getFullName() : "Dr. " + d.getUsername());
            m.put("specialization", d.getSpecialization() != null ? d.getSpecialization() : "General Physician");
            m.put("experienceYears", d.getExperienceYears() != null ? d.getExperienceYears() : "N/A");
            m.put("consultationFee", d.getConsultationFee() != null ? d.getConsultationFee() : 500.0);
            m.put("availableToday", d.isAvailableToday());
            m.put("phoneNumber", d.getPhoneNumber());
            m.put("qrCodeUrl", d.getQrCodeUrl());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // ── Book appointment (creates PENDING + PENDING payment) ────────────────
    @PostMapping("/book")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Book a consultation appointment")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> body,
                                              Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            User patient = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Patient not found"));

            Long doctorId = Long.valueOf(body.get("doctorId").toString());
            User doctor = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));

            if (doctor.getRole() != UserRole.DOCTOR) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid doctor ID", "success", false));
            }

            double fee = doctor.getConsultationFee() != null ? doctor.getConsultationFee() : 500.0;
            double platformFee = 50.0;
            double total = fee + platformFee;

            // Schedule 1 hour from now
            LocalDateTime scheduledTime = LocalDateTime.now().plusHours(1);

            Appointment apt = new Appointment();
            apt.setPatient(patient);
            apt.setDoctor(doctor);
            apt.setFee(total);
            apt.setStatus("PENDING");
            apt.setPaymentStatus("PENDING");
            apt.setScheduledTime(scheduledTime);

            appointmentRepository.save(apt);

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("appointmentId", apt.getId());
            resp.put("doctorName", doctor.getFullName() != null ? "Dr. " + doctor.getFullName() : "Dr. " + doctor.getUsername());
            resp.put("fee", total);
            resp.put("status", apt.getStatus());
            resp.put("paymentStatus", apt.getPaymentStatus());
            resp.put("scheduledTime", scheduledTime.toString());
            resp.put("qrCodeUrl", doctor.getQrCodeUrl());
            resp.put("message", "Appointment created. Please complete payment to confirm.");
            resp.put("success", true);

            log.info("Appointment {} created for patient {} with doctor {}", apt.getId(), patient.getUsername(), doctor.getUsername());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            log.error("Error booking appointment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage(), "success", false));
        }
    }

    // ── Pay for appointment (mock payment → status becomes CONFIRMED) ───────
    @PostMapping("/{id}/pay")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Pay for appointment (mock payment)")
    public ResponseEntity<?> payAppointment(@PathVariable Long id, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            Appointment apt = appointmentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            if (!apt.getPatient().getId().equals(userDetails.getId())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Unauthorized", "success", false));
            }

            apt.setPaymentStatus("PAID");
            apt.setStatus("CONFIRMED");
            appointmentRepository.save(apt);

            Map<String, Object> resp = new LinkedHashMap<>();
            resp.put("appointmentId", apt.getId());
            resp.put("status", apt.getStatus());
            resp.put("paymentStatus", apt.getPaymentStatus());
            resp.put("scheduledTime", apt.getScheduledTime().toString());
            resp.put("meetLink", "https://meet.google.com/mock-" + apt.getId());
            User doctor = apt.getDoctor();
            resp.put("qrCodeUrl", doctor.getQrCodeUrl());
            resp.put("message", "Payment successful! Your appointment is confirmed.");
            resp.put("success", true);

            log.info("Appointment {} paid and confirmed", apt.getId());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            log.error("Error processing payment: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage(), "success", false));
        }
    }

    // ── Patient: get my appointments ─────────────────────────────────────────
    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    @Operation(summary = "Get patient's own appointments")
    public ResponseEntity<?> getMyAppointments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Appointment> appointments = appointmentRepository.findByPatientIdOrderByCreatedAtDesc(userDetails.getId());
        return ResponseEntity.ok(convertList(appointments, false));
    }

    // ── Doctor: get today's appointments ────────────────────────────────────
    @GetMapping("/today")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get doctor's today appointments")
    public ResponseEntity<?> getTodayAppointments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Appointment> appointments = appointmentRepository.findTodayAppointmentsByDoctor(
                userDetails.getId(), startOfDay, endOfDay);
        return ResponseEntity.ok(convertList(appointments, true));
    }

    // ── Doctor: get all appointments ─────────────────────────────────────────
    @GetMapping("/doctor/all")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get all doctor appointments")
    public ResponseEntity<?> getDoctorAllAppointments(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByCreatedAtDesc(userDetails.getId());
        return ResponseEntity.ok(convertList(appointments, true));
    }

    // ── Toggle doctor availability ───────────────────────────────────────────
    @PostMapping("/toggle-availability")
    @PreAuthorize("hasRole('DOCTOR')")
    @Operation(summary = "Toggle doctor availability for today")
    public ResponseEntity<?> toggleAvailability(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User doctor = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAvailableToday(!doctor.isAvailableToday());
        userRepository.save(doctor);
        return ResponseEntity.ok(Map.of(
                "availableToday", doctor.isAvailableToday(),
                "message", doctor.isAvailableToday() ? "You are now available for today" : "You are now unavailable",
                "success", true
        ));
    }

    // ── Admin: Update doctor's QR code ───────────────────────────────────────
    @PutMapping("/{doctorId}/qr-code")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update doctor's payment QR code")
    public ResponseEntity<?> updateQrCode(@PathVariable Long doctorId, 
                                          @RequestBody Map<String, String> body,
                                          Authentication authentication) {
        try {
            User doctor = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            if (doctor.getRole() != UserRole.DOCTOR) {
                return ResponseEntity.badRequest().body(Map.of("message", "Not a doctor", "success", false));
            }
            
            String qrCodeUrl = body.get("qrCodeUrl");
            doctor.setQrCodeUrl(qrCodeUrl);
            userRepository.save(doctor);
            
            return ResponseEntity.ok(Map.of(
                    "message", "QR code updated successfully",
                    "qrCodeUrl", qrCodeUrl,
                    "success", true
            ));
        } catch (Exception e) {
            log.error("Error updating QR code: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage(), "success", false));
        }
    }

    // ── Admin: Update doctor's QR code via file upload ───────────────────────────────────────
    @PostMapping("/{doctorId}/qr-code/upload")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update doctor's payment QR code via file upload")
    public ResponseEntity<?> uploadQrCode(@PathVariable Long doctorId,
                                          @RequestParam("qrCodeFile") MultipartFile qrCodeFile,
                                          Authentication authentication) {
        try {
            User doctor = userRepository.findById(doctorId)
                    .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            if (doctor.getRole() != UserRole.DOCTOR) {
                return ResponseEntity.badRequest().body(Map.of("message", "Not a doctor", "success", false));
            }

            if (qrCodeFile.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Please select a file to upload", "success", false));
            }

            // Store the QR code image
            String qrCodePath = fileStorageService.storeFile(qrCodeFile, "qr-codes");
            String qrCodeUrl = "/api/files/" + qrCodePath;
            
            doctor.setQrCodeUrl(qrCodeUrl);
            userRepository.save(doctor);
            
            return ResponseEntity.ok(Map.of(
                    "message", "QR code uploaded successfully",
                    "qrCodeUrl", qrCodeUrl,
                    "success", true
            ));
        } catch (Exception e) {
            log.error("Error uploading QR code: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage(), "success", false));
        }
    }

    private List<Map<String, Object>> convertList(List<Appointment> appointments, boolean showPatient) {
        return appointments.stream().map(apt -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", apt.getId());
            if (showPatient) {
                User p = apt.getPatient();
                m.put("patientName", p.getFullName() != null ? p.getFullName() : p.getUsername());
                m.put("patientUsername", p.getUsername());
            } else {
                User d = apt.getDoctor();
                m.put("doctorName", d.getFullName() != null ? "Dr. " + d.getFullName() : "Dr. " + d.getUsername());
                m.put("specialization", d.getSpecialization() != null ? d.getSpecialization() : "General Physician");
            }
            m.put("fee", apt.getFee());
            m.put("status", apt.getStatus());
            m.put("paymentStatus", apt.getPaymentStatus());
            m.put("scheduledTime", apt.getScheduledTime() != null ? apt.getScheduledTime().toString() : null);
            m.put("createdAt", apt.getCreatedAt().toString());
            if ("CONFIRMED".equals(apt.getStatus())) {
                m.put("meetLink", "https://meet.google.com/mock-" + apt.getId());
            }
            return m;
        }).collect(Collectors.toList());
    }
}
