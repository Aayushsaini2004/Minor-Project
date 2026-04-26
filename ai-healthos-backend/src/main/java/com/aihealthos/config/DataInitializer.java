package com.aihealthos.config;

import com.aihealthos.model.User;
import com.aihealthos.model.enums.UserRole;
import com.aihealthos.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if admin already exists
        if (!userRepository.existsByUsername("admin")) {
            // Create default admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@aihealthos.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setFullName("System Administrator");
            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            admin.setPhoneNumber("0000000000");
            admin.setAge(30);
            admin.setGender("Male");

            userRepository.save(admin);
            log.info("==========================================");
            log.info("Default ADMIN user created successfully!");
            log.info("Username: admin");
            log.info("Password: Admin@123");
            log.info("==========================================");
        } else {
            log.info("Admin user already exists. Skipping initialization.");
        }
    }
}
