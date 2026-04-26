package com.aihealthos.dto;

import com.aihealthos.model.enums.UserRole;

import java.time.LocalDateTime;

public class UserProfileResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Integer age;
    private String gender;
    private UserRole role;
    private boolean active;
    private LocalDateTime createdAt;

    public UserProfileResponse() {
    }

    public UserProfileResponse(Long id, String username, String email, String fullName, String phoneNumber, Integer age, String gender, UserRole role, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.age = age;
        this.gender = gender;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static UserProfileResponseBuilder builder() {
        return new UserProfileResponseBuilder();
    }

    public static class UserProfileResponseBuilder {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String phoneNumber;
        private Integer age;
        private String gender;
        private UserRole role;
        private boolean active;
        private LocalDateTime createdAt;

        public UserProfileResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserProfileResponseBuilder username(String username) {
            this.username = username;
            return this;
        }

        public UserProfileResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserProfileResponseBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserProfileResponseBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserProfileResponseBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public UserProfileResponseBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public UserProfileResponseBuilder role(UserRole role) {
            this.role = role;
            return this;
        }

        public UserProfileResponseBuilder active(boolean active) {
            this.active = active;
            return this;
        }

        public UserProfileResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserProfileResponse build() {
            return new UserProfileResponse(id, username, email, fullName, phoneNumber, age, gender, role, active, createdAt);
        }
    }
}
