package com.aihealthos.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_diagnoses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageDiagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "image_path", nullable = false)
    private String imagePath;

    @Column(name = "image_type")
    private String imageType;

    @Column(name = "prediction")
    private String prediction;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "possible_conditions", length = 1000)
    private String possibleConditions;

    @Column(name = "ai_analysis", length = 2000)
    private String aiAnalysis;

    @Column(name = "recommendation")
    private String recommendation;

    @Column(name = "reviewed_by_doctor")
    private boolean reviewedByDoctor = false;

    @Column(name = "doctor_notes", length = 1000)
    private String doctorNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
