package com.aihealthos.controller;

import com.aihealthos.dto.MedicalReportResponse;
import com.aihealthos.dto.MessageResponse;
import com.aihealthos.model.MedicalReport;
import com.aihealthos.repository.MedicalReportRepository;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.FileStorageService;
import com.aihealthos.service.MedicalReportService;
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

import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Medical Reports", description = "Medical report upload and analysis APIs")
@SecurityRequirement(name = "bearerAuth")
public class MedicalReportController {

    private static final Logger log = LoggerFactory.getLogger(MedicalReportController.class);

    @Autowired
    private MedicalReportService medicalReportService;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/all-patients")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get all patients medical reports", description = "Doctor views all patients medical reports with patient name")
    public ResponseEntity<?> getAllPatientsMedicalReports() {
        try {
            List<MedicalReport> allReports = medicalReportRepository.findAll();
            List<Map<String, Object>> result = allReports.stream().map(report -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("id", report.getId());
                item.put("patientName", report.getUser().getFullName() != null ? report.getUser().getFullName() : report.getUser().getUsername());
                item.put("patientUsername", report.getUser().getUsername());
                item.put("fileName", report.getFileName());
                item.put("fileType", report.getFileType());
                item.put("extractedText", report.getExtractedText());
                item.put("analysisResult", report.getAnalysisResult());
                item.put("abnormalValuesFound", report.isAbnormalValuesFound());
                item.put("abnormalValuesDetails", report.getAbnormalValuesDetails());
                item.put("simplifiedExplanation", report.getSimplifiedExplanation());
                item.put("reviewedByDoctor", report.isReviewedByDoctor());
                item.put("uploadedAt", report.getUploadedAt());
                item.put("fileViewUrl", "/api/reports/" + report.getId() + "/file");
                return item;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching all patients reports: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @GetMapping("/{id}/file")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "View report file", description = "Serve the uploaded report file (image or PDF)")
    public ResponseEntity<?> viewReportFile(@PathVariable Long id) {
        try {
            Optional<MedicalReport> reportOpt = medicalReportRepository.findById(id);
            if (reportOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            MedicalReport report = reportOpt.get();
            byte[] fileData = fileStorageService.readFile(report.getFilePath());
            String contentType = report.getFileType() != null ? report.getFileType() : "application/octet-stream";
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + report.getFileName() + "\"")
                    .body(fileData);
        } catch (Exception e) {
            log.error("Error serving report file: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Upload medical report", description = "Upload PDF or image report for OCR analysis")
    public ResponseEntity<?> uploadReport(@RequestParam("file") MultipartFile file,
                                         Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Please select a file to upload", false));
        }

        try {
            MedicalReportResponse response = medicalReportService.uploadAndAnalyzeReport(userDetails.getId(), file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error uploading report: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error uploading report: " + e.getMessage(), false));
        }
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get report history", description = "Get user's medical report history")
    public ResponseEntity<?> getReportHistory(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            List<MedicalReportResponse> history = medicalReportService.getUserReports(userDetails.getId());
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error fetching report history: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching history: " + e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get report by ID", description = "Get specific medical report details")
    public ResponseEntity<?> getReportById(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            MedicalReportResponse response = medicalReportService.getReportById(id, userDetails.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error fetching report: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching report: " + e.getMessage(), false));
        }
    }

    @GetMapping("/abnormal")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Get abnormal reports", description = "Get reports with abnormal values")
    public ResponseEntity<?> getAbnormalReports(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            List<MedicalReportResponse> reports = medicalReportService.getAbnormalReports(userDetails.getId());
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            log.error("Error fetching abnormal reports: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error fetching reports: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Delete report", description = "Delete a specific medical report")
    public ResponseEntity<?> deleteReport(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        try {
            medicalReportService.deleteReport(id, userDetails.getId());
            return ResponseEntity.ok(new MessageResponse("Report deleted successfully"));
        } catch (Exception e) {
            log.error("Error deleting report: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error deleting report: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('ADMIN')")
    @Operation(summary = "Mark report as reviewed", description = "Doctor marks report as reviewed")
    public ResponseEntity<?> markAsReviewed(@PathVariable Long id) {
        try {
            medicalReportService.markAsReviewed(id, null);
            return ResponseEntity.ok(new MessageResponse("Report marked as reviewed successfully"));
        } catch (Exception e) {
            log.error("Error marking report as reviewed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }
}
