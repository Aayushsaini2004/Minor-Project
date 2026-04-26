package com.aihealthos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "extracted_text", length = 5000)
    private String extractedText;

    @Column(name = "analysis_result", length = 3000)
    private String analysisResult;

    @Column(name = "abnormal_values_found")
    private boolean abnormalValuesFound = false;

    @Column(name = "abnormal_values_details", length = 2000)
    private String abnormalValuesDetails;

    @Column(name = "simplified_explanation", length = 2000)
    private String simplifiedExplanation;

    @Column(name = "reviewed_by_doctor")
    private boolean reviewedByDoctor = false;

    @CreationTimestamp
    @Column(name = "uploaded_at", nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
