package com.aihealthos.repository;

import com.aihealthos.model.MedicalReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {

    List<MedicalReport> findByUserIdOrderByUploadedAtDesc(Long userId);

    List<MedicalReport> findByAbnormalValuesFound(boolean abnormalFound);

    List<MedicalReport> findByReviewedByDoctor(boolean reviewed);

    @Query("SELECT mr FROM MedicalReport mr WHERE mr.user.id = :userId AND mr.abnormalValuesFound = true ORDER BY mr.uploadedAt DESC")
    List<MedicalReport> findAbnormalReportsByUserId(@Param("userId") Long userId);
}
