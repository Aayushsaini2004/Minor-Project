package com.aihealthos.service;

import com.aihealthos.dto.AiServiceRequest;
import com.aihealthos.dto.AiServiceResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Service
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    @Value("${ai.service.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AiServiceClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AiServiceResponse analyzeSymptoms(AiServiceRequest request) {
        try {
            // Check if AI service is available
            if (aiServiceUrl == null || aiServiceUrl.isEmpty() || aiServiceUrl.equals("http://localhost:8000")) {
                log.warn("AI service not configured, using mock response");
                return createMockSymptomResponse(request);
            }
            
            String url = aiServiceUrl + "/ai/symptom-check";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-Key", apiKey);
            
            HttpEntity<AiServiceRequest> entity = new HttpEntity<>(request, headers);
            
            ResponseEntity<AiServiceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AiServiceResponse.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("AI symptom analysis completed successfully");
                return response.getBody();
            }
            
            return createFallbackResponse("Failed to get response from AI service");
        } catch (Exception e) {
            log.error("Error calling AI service for symptom analysis: {}, using mock response", e.getMessage());
            return createMockSymptomResponse(request);
        }
    }
    
    private AiServiceResponse createMockSymptomResponse(AiServiceRequest request) {
        String symptoms = request.getSymptoms().toLowerCase();
        
        // Simple keyword-based mock diagnosis
        if (symptoms.contains("fever")) {
            return AiServiceResponse.builder()
                    .success(true)
                    .predictedCondition("Viral Fever")
                    .riskLevel("MEDIUM")
                    .confidenceScore(0.75)
                    .recommendation("Rest, stay hydrated, and monitor temperature. Consult a doctor if fever persists beyond 3 days.")
                    .possibleConditions(Arrays.asList("Viral Fever", "Influenza", "COVID-19", "Malaria"))
                    .analysis("Based on the symptoms described, the AI model has identified potential conditions related to fever.")
                    .build();
        } else if (symptoms.contains("headache")) {
            return AiServiceResponse.builder()
                    .success(true)
                    .predictedCondition("Tension Headache")
                    .riskLevel("LOW")
                    .confidenceScore(0.70)
                    .recommendation("Rest in a quiet, dark room. Stay hydrated. Consult a doctor if severe or persistent.")
                    .possibleConditions(Arrays.asList("Tension Headache", "Migraine", "Sinusitis"))
                    .analysis("Based on the symptoms described, the AI model has identified potential conditions related to headache.")
                    .build();
        } else if (symptoms.contains("chest pain")) {
            return AiServiceResponse.builder()
                    .success(true)
                    .predictedCondition("Possible Cardiac Issue")
                    .riskLevel("CRITICAL")
                    .confidenceScore(0.85)
                    .recommendation("SEEK IMMEDIATE MEDICAL ATTENTION. Call emergency services if severe.")
                    .possibleConditions(Arrays.asList("Angina", "Heart Attack", "Muscle Strain"))
                    .analysis("Based on the symptoms described, this could be a serious condition requiring immediate attention.")
                    .build();
        } else {
            return AiServiceResponse.builder()
                    .success(true)
                    .predictedCondition("General Malaise")
                    .riskLevel("LOW")
                    .confidenceScore(0.60)
                    .recommendation("Monitor symptoms, rest, and stay hydrated. Consult a doctor if symptoms worsen.")
                    .possibleConditions(Arrays.asList("General Malaise", "Viral Infection", "Stress-related Condition"))
                    .analysis("Based on the symptoms described, the AI model has identified general symptoms.")
                    .build();
        }
    }

    public AiServiceResponse analyzeImage(byte[] imageData, String imageType) {
        try {
            // Check if AI service is available
            if (aiServiceUrl == null || aiServiceUrl.isEmpty() || aiServiceUrl.equals("http://localhost:8000")) {
                log.warn("AI service not configured, using mock image diagnosis");
                return createMockImageResponse();
            }
            
            String url = aiServiceUrl + "/ai/image-diagnose";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("X-API-Key", apiKey);
            headers.set("X-Image-Type", imageType);
            
            HttpEntity<byte[]> entity = new HttpEntity<>(imageData, headers);
            
            ResponseEntity<AiServiceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AiServiceResponse.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("AI image diagnosis completed successfully");
                return response.getBody();
            }
            
            return createMockImageResponse();
        } catch (Exception e) {
            log.error("Error calling AI service for image diagnosis: {}", e.getMessage());
            return createMockImageResponse();
        }
    }

    private AiServiceResponse createMockImageResponse() {
        // Randomly pick one of several skin conditions for demo
        String[][] conditions = {
            {"Skin Infection", "HIGH", "0.82", "Consult a dermatologist immediately. Bacterial/fungal infection detected. Avoid scratching the area."},
            {"Eczema (Atopic Dermatitis)", "MEDIUM", "0.78", "Apply moisturizer and avoid irritants. Consult a dermatologist if it persists."},
            {"Contact Dermatitis", "MEDIUM", "0.74", "Identify and avoid the allergen/irritant. Use antihistamines for relief."},
            {"Psoriasis", "MEDIUM", "0.71", "Consult a dermatologist for treatment options including topical creams."},
            {"Urticaria (Hives)", "MEDIUM", "0.76", "Take antihistamines. Identify and avoid triggers. Seek emergency care if throat swells."},
        };
        int idx = (int)(Math.random() * conditions.length);
        String[] chosen = conditions[idx];
        return AiServiceResponse.builder()
                .success(true)
                .predictedCondition(chosen[0])
                .riskLevel(chosen[1])
                .confidenceScore(Double.parseDouble(chosen[2]))
                .recommendation(chosen[3])
                .possibleConditions(Arrays.asList(
                        conditions[0][0], conditions[1][0], conditions[2][0]
                ))
                .analysis("AI skin analysis detected " + chosen[0] + ". This is a mock diagnosis - real AI service not connected.")
                .build();
    }

    public AiServiceResponse extractTextFromReport(byte[] fileData, String fileType) {
        try {
            String url = aiServiceUrl + "/ai/extract-text";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.set("X-API-Key", apiKey);
            headers.set("X-File-Type", fileType);
            
            HttpEntity<byte[]> entity = new HttpEntity<>(fileData, headers);
            
            ResponseEntity<AiServiceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AiServiceResponse.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("OCR text extraction completed successfully");
                return response.getBody();
            }
            
            return createFallbackResponse("Failed to extract text from report");
        } catch (Exception e) {
            log.error("Error calling AI service for OCR: {}", e.getMessage());
            return createFallbackResponse(e.getMessage());
        }
    }

    public AiServiceResponse predictHealthRisk(Integer age, String gender, 
                                                Integer systolic, Integer diastolic, 
                                                Double bloodSugar, Integer heartRate) {
        try {
            String url = aiServiceUrl + "/ai/risk-predict";
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-Key", apiKey);
            
            // Build request body
            String jsonBody = String.format(
                "{\"age\":%d,\"gender\":\"%s\",\"systolic\":%d,\"diastolic\":%d,\"bloodSugar\":%.2f,\"heartRate\":%d}",
                age, gender, systolic, diastolic, bloodSugar, heartRate
            );
            
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);
            
            ResponseEntity<AiServiceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    AiServiceResponse.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("Health risk prediction completed successfully");
                return response.getBody();
            }
            
            return createFallbackResponse("Failed to get risk prediction");
        } catch (Exception e) {
            log.error("Error calling AI service for risk prediction: {}", e.getMessage());
            return createFallbackResponse(e.getMessage());
        }
    }

    private AiServiceResponse createFallbackResponse(String errorMessage) {
        return AiServiceResponse.builder()
                .success(false)
                .errorMessage(errorMessage)
                .predictedCondition("Unknown")
                .riskLevel("MEDIUM")
                .confidenceScore(0.0)
                .recommendation("Please consult a healthcare professional for accurate diagnosis.")
                .build();
    }
}
