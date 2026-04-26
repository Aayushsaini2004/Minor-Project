package com.aihealthos.controller;

import com.aihealthos.dto.EmergencyCheckRequest;
import com.aihealthos.dto.EmergencyCheckResponse;
import com.aihealthos.dto.EmergencyLogResponse;
import com.aihealthos.dto.MessageResponse;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.EmergencyService;
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
@RequestMapping("/api/emergency")
@Tag(name = "Emergency Detection", description = "Emergency detection and alert APIs")
@SecurityRequirement(name = "bearerAuth")
public class EmergencyController {

    private static final Logger log = LoggerFactory.getLogger(EmergencyController.class);

    @Autowired
    private EmergencyService emergencyService;

    @PostMapping("/check")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Check for emergency", description = "Check symptoms for emergency conditions")
    public ResponseEntity<?> checkEmergency(@Valid @RequestBody EmergencyCheckRequest request,
                                           Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            EmergencyCheckResponse response = emergencyService.checkEmergency(userDetails.getId(), request);
            
            if (response.isAlertTriggered()) {
                log.warn("Emergency alert triggered for user {}: {}", userDetails.getId(), response.getEmergencyType());
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error checking emergency: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error checking emergency: " + e.getMessage(), false));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get emergency history", description = "Get user's emergency check history")
    public ResponseEntity<?> getEmergencyHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            List<EmergencyLogResponse> history = emergencyService.getUserEmergencyHistory(userDetails.getId());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching emergency history: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching history: " + e.getMessage(), false));
        }
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get active emergencies", description = "Get all active emergency alerts (Doctor/Admin only)")
    public ResponseEntity<?> getActiveEmergencies() {
        try {
            List<EmergencyLogResponse> emergencies = emergencyService.getActiveEmergencies();
            return ResponseEntity.ok(emergencies);
        } catch (Exception e) {
            log.error("Error fetching active emergencies: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching emergencies: " + e.getMessage(), false));
        }
    }

    @GetMapping("/active-count")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get active emergency count", description = "Get count of active emergency alerts")
    public ResponseEntity<?> getActiveEmergencyCount() {
        try {
            long count = emergencyService.getActiveEmergencyCount();
            return ResponseEntity.ok(new MessageResponse("Active emergencies: " + count, true, count));
        } catch (Exception e) {
            log.error("Error fetching emergency count: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Resolve emergency", description = "Mark an emergency as resolved")
    public ResponseEntity<?> resolveEmergency(@PathVariable Long id,
                                             @RequestParam(required = false) String resolutionNotes) {
        try {
            emergencyService.resolveEmergency(id, resolutionNotes);
            return ResponseEntity.ok(new MessageResponse("Emergency resolved successfully"));
        } catch (Exception e) {
            log.error("Error resolving emergency: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error resolving emergency: " + e.getMessage(), false));
        }
    }

    @PostMapping("/{id}/assign-driver")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Assign ambulance driver", description = "Manually assign an ambulance driver to emergency")
    public ResponseEntity<?> assignDriver(@PathVariable Long id,
                                          @RequestParam Long driverId) {
        try {
            emergencyService.assignDriverToEmergency(id, driverId);
            return ResponseEntity.ok(new MessageResponse("Driver assigned successfully"));
        } catch (Exception e) {
            log.error("Error assigning driver: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/driver-status")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Update driver status", description = "Update the status of assigned driver")
    public ResponseEntity<?> updateDriverStatus(@PathVariable Long id,
                                                 @RequestParam String status) {
        try {
            emergencyService.updateDriverStatus(id, status);
            return ResponseEntity.ok(new MessageResponse("Driver status updated successfully"));
        } catch (Exception e) {
            log.error("Error updating driver status: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @GetMapping("/{id}/track-driver")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Track assigned driver", description = "Get real-time location of assigned ambulance driver")
    public ResponseEntity<?> trackDriver(@PathVariable Long id) {
        try {
            Object trackingInfo = emergencyService.getDriverTrackingInfo(id);
            return ResponseEntity.ok(trackingInfo);
        } catch (Exception e) {
            log.error("Error tracking driver: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }
}
