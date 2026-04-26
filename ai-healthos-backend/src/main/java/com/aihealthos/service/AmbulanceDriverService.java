package com.aihealthos.service;

import com.aihealthos.dto.AmbulanceDriverRequest;
import com.aihealthos.dto.AmbulanceDriverResponse;
import com.aihealthos.model.AmbulanceDriver;
import com.aihealthos.repository.AmbulanceDriverRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmbulanceDriverService {

    private static final Logger log = LoggerFactory.getLogger(AmbulanceDriverService.class);

    @Autowired
    private AmbulanceDriverRepository ambulanceDriverRepository;

    @Transactional
    public AmbulanceDriverResponse createDriver(AmbulanceDriverRequest request) {
        // Check if phone number already exists
        if (ambulanceDriverRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }

        AmbulanceDriver driver = new AmbulanceDriver();
        driver.setFullName(request.getFullName());
        driver.setPhoneNumber(request.getPhoneNumber());
        driver.setAge(request.getAge());
        driver.setAmbulanceNumber(request.getAmbulanceNumber());
        driver.setCurrentLocation(request.getCurrentLocation());
        driver.setLatitude(request.getLatitude());
        driver.setLongitude(request.getLongitude());
        driver.setCity(request.getCity());
        driver.setAvailable(request.isAvailable());
        driver.setActive(true);
        driver.setLicensePlate(request.getLicensePlate());
        driver.setEmergencyEquipment(request.getEmergencyEquipment());

        AmbulanceDriver savedDriver = ambulanceDriverRepository.save(driver);
        log.info("Created ambulance driver: {}", savedDriver.getPhoneNumber());

        return convertToResponse(savedDriver);
    }

    @Transactional
    public AmbulanceDriverResponse updateDriver(Long id, AmbulanceDriverRequest request) {
        AmbulanceDriver driver = ambulanceDriverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setFullName(request.getFullName());
        driver.setAge(request.getAge());
        driver.setAmbulanceNumber(request.getAmbulanceNumber());
        driver.setCurrentLocation(request.getCurrentLocation());
        driver.setLatitude(request.getLatitude());
        driver.setLongitude(request.getLongitude());
        driver.setCity(request.getCity());
        driver.setAvailable(request.isAvailable());
        driver.setLicensePlate(request.getLicensePlate());
        driver.setEmergencyEquipment(request.getEmergencyEquipment());

        AmbulanceDriver updatedDriver = ambulanceDriverRepository.save(driver);
        log.info("Updated ambulance driver: {}", updatedDriver.getId());

        return convertToResponse(updatedDriver);
    }

    @Transactional(readOnly = true)
    public AmbulanceDriverResponse getDriverById(Long id) {
        AmbulanceDriver driver = ambulanceDriverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        return convertToResponse(driver);
    }

    @Transactional(readOnly = true)
    public List<AmbulanceDriverResponse> getAllDrivers() {
        List<AmbulanceDriver> drivers = ambulanceDriverRepository.findAll();
        return drivers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AmbulanceDriverResponse> getAvailableDrivers() {
        List<AmbulanceDriver> drivers = ambulanceDriverRepository.findAvailableDriversWithLocation();
        return drivers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AmbulanceDriverResponse> getDriversByCity(String city) {
        List<AmbulanceDriver> drivers = ambulanceDriverRepository.findAvailableDriversByCity(city);
        return drivers.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AmbulanceDriverResponse updateAvailability(Long id, boolean available) {
        AmbulanceDriver driver = ambulanceDriverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setAvailable(available);
        AmbulanceDriver updatedDriver = ambulanceDriverRepository.save(driver);
        log.info("Updated availability for driver {}: {}", id, available);

        return convertToResponse(updatedDriver);
    }

    @Transactional
    public AmbulanceDriverResponse updateLocation(Long id, Double latitude, Double longitude, String currentLocation) {
        AmbulanceDriver driver = ambulanceDriverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setLatitude(latitude);
        driver.setLongitude(longitude);
        if (currentLocation != null) {
            driver.setCurrentLocation(currentLocation);
        }
        
        AmbulanceDriver updatedDriver = ambulanceDriverRepository.save(driver);
        log.info("Updated location for driver {}: {}, {}", id, latitude, longitude);

        return convertToResponse(updatedDriver);
    }

    @Transactional
    public void deactivateDriver(Long id) {
        AmbulanceDriver driver = ambulanceDriverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setActive(false);
        driver.setAvailable(false);
        ambulanceDriverRepository.save(driver);
        log.info("Deactivated ambulance driver: {}", id);
    }

    private AmbulanceDriverResponse convertToResponse(AmbulanceDriver driver) {
        return AmbulanceDriverResponse.builder()
                .id(driver.getId())
                .fullName(driver.getFullName())
                .phoneNumber(driver.getPhoneNumber())
                .age(driver.getAge())
                .ambulanceNumber(driver.getAmbulanceNumber())
                .currentLocation(driver.getCurrentLocation())
                .latitude(driver.getLatitude())
                .longitude(driver.getLongitude())
                .city(driver.getCity())
                .available(driver.isAvailable())
                .active(driver.isActive())
                .licensePlate(driver.getLicensePlate())
                .emergencyEquipment(driver.getEmergencyEquipment())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .build();
    }
}
