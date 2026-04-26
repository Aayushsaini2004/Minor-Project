package com.aihealthos.model;

import com.aihealthos.model.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "symptoms", length = 2000, nullable = false)
    private String symptoms;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", nullable = false)
    private RiskLevel riskLevel;

    @Column(name = "alert_triggered", nullable = false)
    private boolean alertTriggered = false;

    @Column(name = "alert_message", length = 1000)
    private String alertMessage;

    @Column(name = "emergency_type")
    private String emergencyType;

    @Column(name = "contacted_emergency_contact")
    private boolean contactedEmergencyContact = false;

    @Column(name = "emergency_contact_phone")
    private String emergencyContactPhone;

    @Column(name = "location")
    private String location;

    @Column(name = "user_latitude")
    private Double userLatitude;

    @Column(name = "user_longitude")
    private Double userLongitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_driver_id")
    private AmbulanceDriver assignedDriver;

    @Column(name = "driver_assigned_at")
    private LocalDateTime driverAssignedAt;

    @Column(name = "driver_status")
    private String driverStatus; // PENDING, ACCEPTED, EN_ROUTE, ARRIVED

    @Column(name = "estimated_arrival_time")
    private LocalDateTime estimatedArrivalTime;

    @Column(name = "resolved")
    private boolean resolved = false;

    @Column(name = "resolution_notes", length = 1000)
    private String resolutionNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
