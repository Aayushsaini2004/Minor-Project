package com.aihealthos.service;

import com.aihealthos.dto.AiServiceResponse;
import com.aihealthos.dto.MedicalReportResponse;
import com.aihealthos.model.MedicalReport;
import com.aihealthos.model.User;
import com.aihealthos.repository.MedicalReportRepository;
import com.aihealthos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MedicalReportService {

    private static final Logger log = LoggerFactory.getLogger(MedicalReportService.class);

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AiServiceClient aiServiceClient;

    @Transactional
    public MedicalReportResponse uploadAndAnalyzeReport(Long userId, MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        // Store file
        String filePath = fileStorageService.storeFile(file, "reports");

        // Create report entity
        MedicalReport report = new MedicalReport();
        report.setUser(user);
        report.setFileName(file.getOriginalFilename());
        report.setFilePath(filePath);
        report.setFileType(file.getContentType());
        report.setFileSize(file.getSize());

        MedicalReport savedReport = medicalReportRepository.save(report);

        // Perform OCR and analysis asynchronously (or synchronously for simplicity)
        try {
            analyzeReport(savedReport);
        } catch (Exception e) {
            log.error("Error analyzing report: {}", e.getMessage());
        }

        return convertToResponse(savedReport);
    }

    @Transactional
    public void analyzeReport(MedicalReport report) {
        try {
            // Read file bytes
            byte[] fileData = fileStorageService.readFile(report.getFilePath());
            String fileType = fileStorageService.getFileExtension(report.getFileName());

            // Call AI service for OCR
            AiServiceResponse ocrResponse = aiServiceClient.extractTextFromReport(fileData, fileType);

            if (ocrResponse.isSuccess()) {
                report.setExtractedText(ocrResponse.getAnalysis());
                
                // Analyze extracted text for abnormal values
                String analysis = analyzeForAbnormalValues(ocrResponse.getAnalysis());
                report.setAnalysisResult(analysis);
                
                // Check if abnormal values found
                boolean hasAbnormal = detectAbnormalValues(ocrResponse.getAnalysis());
                report.setAbnormalValuesFound(hasAbnormal);
                
                if (hasAbnormal) {
                    report.setAbnormalValuesDetails(extractAbnormalValues(ocrResponse.getAnalysis()));
                    report.setSimplifiedExplanation(generateSimplifiedExplanation(ocrResponse.getAnalysis()));
                }

                medicalReportRepository.save(report);
                log.info("Report {} analyzed successfully", report.getId());
            }
        } catch (Exception e) {
            log.error("Error in report analysis: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<MedicalReportResponse> getUserReports(Long userId) {
        List<MedicalReport> reports = medicalReportRepository.findByUserIdOrderByUploadedAtDesc(userId);
        return reports.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MedicalReportResponse getReportById(Long reportId, Long userId) {
        Optional<MedicalReport> reportOpt = medicalReportRepository.findById(reportId);
        
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found");
        }

        MedicalReport report = reportOpt.get();
        if (!report.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to report");
        }

        return convertToResponse(report);
    }

    @Transactional(readOnly = true)
    public List<MedicalReportResponse> getAbnormalReports(Long userId) {
        List<MedicalReport> reports = medicalReportRepository.findAbnormalReportsByUserId(userId);
        return reports.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReport(Long reportId, Long userId) {
        Optional<MedicalReport> reportOpt = medicalReportRepository.findById(reportId);
        
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found");
        }

        MedicalReport report = reportOpt.get();
        if (!report.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to report");
        }

        // Delete file
        fileStorageService.deleteFile(report.getFilePath());
        
        // Delete record
        medicalReportRepository.delete(report);
        log.info("Report {} deleted for user {}", reportId, userId);
    }

    @Transactional
    public void markAsReviewed(Long reportId, String doctorNotes) {
        Optional<MedicalReport> reportOpt = medicalReportRepository.findById(reportId);
        
        if (reportOpt.isEmpty()) {
            throw new RuntimeException("Report not found");
        }

        MedicalReport report = reportOpt.get();
        report.setReviewedByDoctor(true);
        
        medicalReportRepository.save(report);
        log.info("Report {} marked as reviewed", reportId);
    }

    private String analyzeForAbnormalValues(String extractedText) {
        if (extractedText == null || extractedText.isEmpty()) {
            return "No text could be extracted from the report.";
        }

        StringBuilder analysis = new StringBuilder();
        String lowerText = extractedText.toLowerCase();

        // Check for common medical terms and values
        if (lowerText.contains("glucose") || lowerText.contains("sugar")) {
            analysis.append("Blood sugar levels mentioned. ");
        }
        if (lowerText.contains("cholesterol")) {
            analysis.append("Cholesterol levels mentioned. ");
        }
        if (lowerText.contains("blood pressure") || lowerText.contains("bp")) {
            analysis.append("Blood pressure readings found. ");
        }
        if (lowerText.contains("hemoglobin") || lowerText.contains("hb")) {
            analysis.append("Hemoglobin levels mentioned. ");
        }

        return analysis.length() > 0 ? analysis.toString() : "Report analyzed. No specific abnormalities flagged.";
    }

    private boolean detectAbnormalValues(String extractedText) {
        if (extractedText == null) return false;
        
        String lowerText = extractedText.toLowerCase();
        
        // Keywords indicating abnormal values
        String[] abnormalIndicators = {
            "high", "low", "elevated", "decreased", "abnormal", 
            "critical", "alert", "out of range", "positive"
        };
        
        for (String indicator : abnormalIndicators) {
            if (lowerText.contains(indicator)) {
                return true;
            }
        }
        
        return false;
    }

    private String extractAbnormalValues(String extractedText) {
        // Simplified extraction - in production, use more sophisticated NLP
        return "Some values appear to be outside normal ranges. Please consult your doctor.";
    }

    private String generateSimplifiedExplanation(String extractedText) {
        return "Your medical report has been analyzed. Some values may require attention. " +
               "Please discuss these results with your healthcare provider for a complete understanding.";
    }

    private MedicalReportResponse convertToResponse(MedicalReport report) {
        return MedicalReportResponse.builder()
                .id(report.getId())
                .fileName(report.getFileName())
                .fileType(report.getFileType())
                .fileSize(report.getFileSize())
                .extractedText(report.getExtractedText())
                .analysisResult(report.getAnalysisResult())
                .abnormalValuesFound(report.isAbnormalValuesFound())
                .abnormalValuesDetails(report.getAbnormalValuesDetails())
                .simplifiedExplanation(report.getSimplifiedExplanation())
                .reviewedByDoctor(report.isReviewedByDoctor())
                .uploadedAt(report.getUploadedAt())
                .build();
    }
}
