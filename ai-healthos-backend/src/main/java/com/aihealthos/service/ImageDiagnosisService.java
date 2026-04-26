package com.aihealthos.service;

import com.aihealthos.dto.AiServiceResponse;
import com.aihealthos.dto.ImageDiagnosisResponse;
import com.aihealthos.model.ImageDiagnosis;
import com.aihealthos.model.User;
import com.aihealthos.repository.ImageDiagnosisRepository;
import com.aihealthos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageDiagnosisService {

    private static final Logger log = LoggerFactory.getLogger(ImageDiagnosisService.class);

    @Autowired
    private ImageDiagnosisRepository imageDiagnosisRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AiServiceClient aiServiceClient;

    @Transactional
    public ImageDiagnosisResponse uploadAndDiagnose(Long userId, MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        // Store file
        String filePath = fileStorageService.storeFile(file, "images");

        // Create diagnosis entity
        ImageDiagnosis diagnosis = new ImageDiagnosis();
        diagnosis.setUser(user);
        diagnosis.setImagePath(filePath);
        diagnosis.setImageType(file.getContentType());

        ImageDiagnosis savedDiagnosis = imageDiagnosisRepository.save(diagnosis);

        // Perform AI diagnosis
        try {
            performDiagnosis(savedDiagnosis, file);
        } catch (Exception e) {
            log.error("Error performing image diagnosis: {}", e.getMessage());
        }

        return convertToResponse(savedDiagnosis);
    }

    @Transactional
    public void performDiagnosis(ImageDiagnosis diagnosis, MultipartFile file) {
        try {
            // Read file bytes
            byte[] imageData = file.getBytes();
            String imageType = fileStorageService.getFileExtension(file.getOriginalFilename());

            // Call AI service for image diagnosis
            AiServiceResponse aiResponse = aiServiceClient.analyzeImage(imageData, imageType);

            if (aiResponse.isSuccess()) {
                diagnosis.setPrediction(aiResponse.getPredictedCondition());
                diagnosis.setConfidenceScore(aiResponse.getConfidenceScore());
                diagnosis.setRecommendation(aiResponse.getRecommendation());
                diagnosis.setAiAnalysis(aiResponse.getAnalysis());
                
                if (aiResponse.getPossibleConditions() != null) {
                    diagnosis.setPossibleConditions(String.join(", ", aiResponse.getPossibleConditions()));
                }

                imageDiagnosisRepository.save(diagnosis);
                log.info("Image diagnosis {} completed: {}", diagnosis.getId(), diagnosis.getPrediction());
            }
        } catch (Exception e) {
            log.error("Error in image diagnosis: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<ImageDiagnosisResponse> getUserDiagnoses(Long userId) {
        List<ImageDiagnosis> diagnoses = imageDiagnosisRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return diagnoses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ImageDiagnosisResponse getDiagnosisById(Long diagnosisId, Long userId) {
        Optional<ImageDiagnosis> diagnosisOpt = imageDiagnosisRepository.findById(diagnosisId);
        
        if (diagnosisOpt.isEmpty()) {
            throw new RuntimeException("Image diagnosis not found");
        }

        ImageDiagnosis diagnosis = diagnosisOpt.get();
        if (!diagnosis.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to diagnosis");
        }

        return convertToResponse(diagnosis);
    }

    @Transactional
    public void deleteDiagnosis(Long diagnosisId, Long userId) {
        Optional<ImageDiagnosis> diagnosisOpt = imageDiagnosisRepository.findById(diagnosisId);
        
        if (diagnosisOpt.isEmpty()) {
            throw new RuntimeException("Image diagnosis not found");
        }

        ImageDiagnosis diagnosis = diagnosisOpt.get();
        if (!diagnosis.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to diagnosis");
        }

        // Delete file
        fileStorageService.deleteFile(diagnosis.getImagePath());
        
        // Delete record
        imageDiagnosisRepository.delete(diagnosis);
        log.info("Image diagnosis {} deleted for user {}", diagnosisId, userId);
    }

    @Transactional
    public void markAsReviewed(Long diagnosisId, String doctorNotes) {
        Optional<ImageDiagnosis> diagnosisOpt = imageDiagnosisRepository.findById(diagnosisId);
        
        if (diagnosisOpt.isEmpty()) {
            throw new RuntimeException("Image diagnosis not found");
        }

        ImageDiagnosis diagnosis = diagnosisOpt.get();
        diagnosis.setReviewedByDoctor(true);
        diagnosis.setDoctorNotes(doctorNotes);
        
        imageDiagnosisRepository.save(diagnosis);
        log.info("Image diagnosis {} marked as reviewed", diagnosisId);
    }

    private ImageDiagnosisResponse convertToResponse(ImageDiagnosis diagnosis) {
        List<String> possibleConditions = null;
        if (diagnosis.getPossibleConditions() != null && !diagnosis.getPossibleConditions().isEmpty()) {
            possibleConditions = Arrays.asList(diagnosis.getPossibleConditions().split(", "));
        }

        String imageUrl = "/api/images/" + diagnosis.getImagePath();

        return ImageDiagnosisResponse.builder()
                .id(diagnosis.getId())
                .imageUrl(imageUrl)
                .prediction(diagnosis.getPrediction())
                .confidenceScore(diagnosis.getConfidenceScore())
                .possibleConditions(possibleConditions)
                .aiAnalysis(diagnosis.getAiAnalysis())
                .recommendation(diagnosis.getRecommendation())
                .reviewedByDoctor(diagnosis.isReviewedByDoctor())
                .doctorNotes(diagnosis.getDoctorNotes())
                .createdAt(diagnosis.getCreatedAt())
                .build();
    }
}
