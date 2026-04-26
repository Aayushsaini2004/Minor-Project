package com.aihealthos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmbulanceDriverResponse {
    
    private Long id;
    
    private String fullName;
    
    private String phoneNumber;
    
    private Integer age;
    
    private String ambulanceNumber;
    
    private String currentLocation;
    
    private Double latitude;
    
    private Double longitude;
    
    private String city;
    
    private boolean available;
    
    private boolean active;
    
    private String licensePlate;
    
    private String emergencyEquipment;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private Double distanceInKm; // Calculated distance from user
}
