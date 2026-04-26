package com.aihealthos.controller;

import com.aihealthos.dto.ImageDiagnosisResponse;
import com.aihealthos.dto.MessageResponse;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.FileStorageService;
import com.aihealthos.service.ImageDiagnosisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/image-diagnosis")
@Tag(name = "Image Diagnosis", description = "AI-powered medical image diagnosis APIs")
@SecurityRequirement(name = "bearerAuth")
public class ImageDiagnosisController {

    private static final Logger log = LoggerFactory.getLogger(ImageDiagnosisController.class);

    @Autowired
    private ImageDiagnosisService imageDiagnosisService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Upload image for diagnosis", description = "Upload medical image for AI diagnosis")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file,
                                        Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Please select an image to upload", false));
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Only image files are allowed", false));
        }

        try {
            ImageDiagnosisResponse response = imageDiagnosisService.uploadAndDiagnose(userDetails.getId(), file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading image: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error uploading image: " + e.getMessage(), false));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get diagnosis history", description = "Get user's image diagnosis history")
    public ResponseEntity<?> getDiagnosisHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            List<ImageDiagnosisResponse> history = imageDiagnosisService.getUserDiagnoses(userDetails.getId());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching diagnosis history: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching history: " + e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get diagnosis by ID", description = "Get specific image diagnosis details")
    public ResponseEntity<?> getDiagnosisById(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            ImageDiagnosisResponse response = imageDiagnosisService.getDiagnosisById(id, userDetails.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching diagnosis: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching diagnosis: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Delete diagnosis", description = "Delete a specific image diagnosis")
    public ResponseEntity<?> deleteDiagnosis(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            imageDiagnosisService.deleteDiagnosis(id, userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Diagnosis deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting diagnosis: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error deleting diagnosis: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Mark diagnosis as reviewed", description = "Doctor marks image diagnosis as reviewed")
    public ResponseEntity<?> markAsReviewed(@PathVariable Long id,
                                           @RequestParam(required = false) String doctorNotes) {
        try {
            imageDiagnosisService.markAsReviewed(id, doctorNotes);
            return ResponseEntity.ok(new MessageResponse("Diagnosis marked as reviewed successfully"));
        } catch (Exception e) {
            log.error("Error marking diagnosis as reviewed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }
}
