package com.aihealthos.controller;

import com.aihealthos.dto.AmbulanceDriverRequest;
import com.aihealthos.dto.AmbulanceDriverResponse;
import com.aihealthos.dto.MessageResponse;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.AmbulanceDriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ambulance")
@Tag(name = "Ambulance Management", description = "Admin APIs for managing ambulance drivers")
@SecurityRequirement(name = "bearerAuth")
public class AmbulanceController {

    private static final Logger log = LoggerFactory.getLogger(AmbulanceController.class);

    @Autowired
    private AmbulanceDriverService ambulanceDriverService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create ambulance driver", description = "Register a new ambulance driver")
    public ResponseEntity<?> createAmbulanceDriver(@Valid @RequestBody AmbulanceDriverRequest request) {
        try {
            AmbulanceDriverResponse driver = ambulanceDriverService.createDriver(request);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error creating ambulance driver: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error creating driver: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update ambulance driver", description = "Update ambulance driver details")
    public ResponseEntity<?> updateAmbulanceDriver(@PathVariable Long id,
                                                    @Valid @RequestBody AmbulanceDriverRequest request) {
        try {
            AmbulanceDriverResponse driver = ambulanceDriverService.updateDriver(id, request);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error updating ambulance driver: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error updating driver: " + e.getMessage(), false));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('USER')")
    @Operation(summary = "Get ambulance driver", description = "Get ambulance driver by ID")
    public ResponseEntity<?> getAmbulanceDriver(@PathVariable Long id) {
        try {
            AmbulanceDriverResponse driver = ambulanceDriverService.getDriverById(id);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error fetching ambulance driver: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Get all ambulance drivers", description = "Get all registered ambulance drivers")
    public ResponseEntity<?> getAllAmbulanceDrivers() {
        try {
            List<AmbulanceDriverResponse> drivers = ambulanceDriverService.getAllDrivers();
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            log.error("Error fetching ambulance drivers: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('USER')")
    @Operation(summary = "Get available ambulance drivers", description = "Get all available ambulance drivers")
    public ResponseEntity<?> getAvailableAmbulanceDrivers() {
        try {
            List<AmbulanceDriverResponse> drivers = ambulanceDriverService.getAvailableDrivers();
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            log.error("Error fetching available ambulance drivers: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @GetMapping("/city/{city}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('USER')")
    @Operation(summary = "Get drivers by city", description = "Get available ambulance drivers in a specific city")
    public ResponseEntity<?> getAmbulanceDriversByCity(@PathVariable String city) {
        try {
            List<AmbulanceDriverResponse> drivers = ambulanceDriverService.getDriversByCity(city);
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            log.error("Error fetching ambulance drivers by city: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Update driver availability", description = "Mark driver as available or unavailable")
    public ResponseEntity<?> updateDriverAvailability(@PathVariable Long id,
                                                       @RequestParam boolean available) {
        try {
            AmbulanceDriverResponse driver = ambulanceDriverService.updateAvailability(id, available);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error updating driver availability: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @PutMapping("/{id}/location")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    @Operation(summary = "Update driver location", description = "Update driver's current location")
    public ResponseEntity<?> updateDriverLocation(@PathVariable Long id,
                                                   @RequestParam Double latitude,
                                                   @RequestParam Double longitude,
                                                   @RequestParam(required = false) String currentLocation) {
        try {
            AmbulanceDriverResponse driver = ambulanceDriverService.updateLocation(id, latitude, longitude, currentLocation);
            return ResponseEntity.ok(driver);
        } catch (Exception e) {
            log.error("Error updating driver location: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate ambulance driver", description = "Deactivate an ambulance driver")
    public ResponseEntity<?> deactivateAmbulanceDriver(@PathVariable Long id) {
        try {
            ambulanceDriverService.deactivateDriver(id);
            return ResponseEntity.ok(new MessageResponse("Ambulance driver deactivated successfully"));
        } catch (Exception e) {
            log.error("Error deactivating ambulance driver: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage(), false));
        }
    }
}
