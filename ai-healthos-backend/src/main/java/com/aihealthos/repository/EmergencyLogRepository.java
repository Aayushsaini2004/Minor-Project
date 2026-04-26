package com.aihealthos.repository;

import com.aihealthos.model.EmergencyLog;
import com.aihealthos.model.enums.RiskLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyLogRepository extends JpaRepository<EmergencyLog, Long> {

    List<EmergencyLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<EmergencyLog> findByAlertTriggered(boolean triggered);

    List<EmergencyLog> findByResolved(boolean resolved);

    List<EmergencyLog> findByRiskLevel(RiskLevel riskLevel);

    @Query("SELECT el FROM EmergencyLog el WHERE el.alertTriggered = true AND el.resolved = false ORDER BY el.createdAt DESC")
    List<EmergencyLog> findActiveEmergencies();

    @Query("SELECT el FROM EmergencyLog el WHERE el.user.id = :userId AND el.createdAt >= :since ORDER BY el.createdAt DESC")
    List<EmergencyLog> findRecentByUserId(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(el) FROM EmergencyLog el WHERE el.alertTriggered = true AND el.resolved = false")
    long countByAlertTriggeredAndResolvedFalse();
}
