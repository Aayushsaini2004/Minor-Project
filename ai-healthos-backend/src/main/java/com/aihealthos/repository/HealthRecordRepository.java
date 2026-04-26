package com.aihealthos.repository;

import com.aihealthos.model.HealthRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {

    List<HealthRecord> findByUserIdOrderByRecordedAtDesc(Long userId);

    List<HealthRecord> findByUserIdAndRecordedAtBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT hr FROM HealthRecord hr WHERE hr.user.id = :userId ORDER BY hr.recordedAt DESC")
    List<HealthRecord> findLatestRecordsByUserId(@Param("userId") Long userId);

    @Query("SELECT hr FROM HealthRecord hr WHERE hr.user.id = :userId AND hr.recordedAt >= :since ORDER BY hr.recordedAt DESC")
    List<HealthRecord> findRecentRecords(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}
