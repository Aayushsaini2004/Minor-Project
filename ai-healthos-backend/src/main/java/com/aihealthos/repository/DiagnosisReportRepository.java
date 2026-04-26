package com.aihealthos.repository;

import com.aihealthos.model.DiagnosisReport;
import com.aihealthos.model.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiagnosisReportRepository extends JpaRepository<DiagnosisReport, Long> {

    List<DiagnosisReport> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<DiagnosisReport> findByRiskLevel(RiskLevel riskLevel);

    List<DiagnosisReport> findByReviewedByDoctor(boolean reviewed);

    @Query("SELECT dr FROM DiagnosisReport dr WHERE dr.riskLevel IN (:riskLevels) ORDER BY dr.createdAt DESC")
    List<DiagnosisReport> findByRiskLevelsOrderByCreatedAtDesc(@Param("riskLevels") List<RiskLevel> riskLevels);

    @Query("SELECT dr FROM DiagnosisReport dr WHERE dr.user.id = :userId AND dr.createdAt >= :since ORDER BY dr.createdAt DESC")
    List<DiagnosisReport> findRecentByUserId(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    long countByRiskLevelAndReviewedByDoctorFalse(RiskLevel riskLevel);
}
