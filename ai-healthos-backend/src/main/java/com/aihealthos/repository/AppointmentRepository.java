package com.aihealthos.repository;

import com.aihealthos.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.scheduledTime >= :startOfDay AND a.scheduledTime < :endOfDay ORDER BY a.scheduledTime ASC")
    List<Appointment> findTodayAppointmentsByDoctor(@Param("doctorId") Long doctorId,
                                                     @Param("startOfDay") LocalDateTime startOfDay,
                                                     @Param("endOfDay") LocalDateTime endOfDay);
}
