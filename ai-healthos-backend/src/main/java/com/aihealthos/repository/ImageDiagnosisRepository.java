package com.aihealthos.repository;

import com.aihealthos.model.ImageDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageDiagnosisRepository extends JpaRepository<ImageDiagnosis, Long> {

    List<ImageDiagnosis> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<ImageDiagnosis> findByReviewedByDoctor(boolean reviewed);

    @Query("SELECT id FROM ImageDiagnosis id WHERE id.user.id = :userId AND id.confidenceScore >= :minConfidence ORDER BY id.createdAt DESC")
    List<ImageDiagnosis> findHighConfidenceDiagnoses(@Param("userId") Long userId, @Param("minConfidence") Double minConfidence);
}
