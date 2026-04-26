package com.aihealthos.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmbulanceDriverRequest {
    
    private String fullName;
    
    private String phoneNumber;
    
    private Integer age;
    
    private String ambulanceNumber;
    
    private String currentLocation;
    
    private Double latitude;
    
    private Double longitude;
    
    private String city;
    
    private boolean available;
    
    private String licensePlate;
    
    private String emergencyEquipment;
}
