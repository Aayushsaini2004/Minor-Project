package com.aihealthos.controller;

import com.aihealthos.dto.*;
import com.aihealthos.model.User;
import com.aihealthos.model.enums.UserRole;
import com.aihealthos.repository.UserRepository;
import com.aihealthos.security.jwt.JwtUtils;
import com.aihealthos.security.services.UserDetailsImpl;
import com.aihealthos.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role(UserRole.valueOf(userDetails.getRole()))
                .message("Login successful")
                .build());
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user account (only USER and DOCTOR roles allowed)")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterRequest registerRequest,
            @RequestParam(value = "qrCodeFile", required = false) MultipartFile qrCodeFile) {
        // Prevent ADMIN role registration - admin is created manually
        if (registerRequest.getRole() == UserRole.ADMIN) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Cannot register as ADMIN. Admin account is pre-created.", false));
        }

        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!", false));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!", false));
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(encoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setAge(registerRequest.getAge());
        user.setGender(registerRequest.getGender());
        user.setRole(registerRequest.getRole());
        user.setActive(true);

        // Save doctor-specific fields if role is DOCTOR
        if (registerRequest.getRole() == UserRole.DOCTOR) {
            user.setSpecialization(registerRequest.getSpecialization());
            user.setExperienceYears(registerRequest.getExperienceYears());
            user.setConsultationFee(registerRequest.getConsultationFee());
            user.setAvailableToday(registerRequest.isAvailableToday());
            
            // Handle QR code file upload if provided
            if (qrCodeFile != null && !qrCodeFile.isEmpty()) {
                String qrCodePath = fileStorageService.storeFile(qrCodeFile, "qr-codes");
                user.setQrCodeUrl("/api/files/" + qrCodePath);
            }
        }

        userRepository.save(user);

        log.info("New user registered: {} with role: {}", user.getUsername(), user.getRole());

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current user profile", description = "Get profile of currently logged in user")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        Optional<User> userOpt = userRepository.findById(userDetails.getId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("User not found", false));
        }

        User user = userOpt.get();
        UserProfileResponse profile = UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .age(user.getAge())
                .gender(user.getGender())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();

        return ResponseEntity.ok(profile);
    }

    @PostMapping("/refresh")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Refresh token", description = "Get a new JWT token")
    public ResponseEntity<?> refreshToken(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        String newToken = jwtUtils.generateTokenFromUsername(
                userDetails.getUsername(),
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getRole()
        );

        return ResponseEntity.ok(AuthResponse.builder()
                .token(newToken)
                .type("Bearer")
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role(UserRole.valueOf(userDetails.getRole()))
                .message("Token refreshed successfully")
                .build());
    }
}
