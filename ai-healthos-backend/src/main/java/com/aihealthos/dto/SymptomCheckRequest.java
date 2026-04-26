package com.aihealthos.dto;

import jakarta.validation.constraints.NotBlank;

public class SymptomCheckRequest {

    @NotBlank(message = "Symptoms description is required")
    private String symptoms;

    private Integer age;
    private String gender;
    private String additionalNotes;

    public String getSymptoms() {
        return symptoms;
    }

    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
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

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
}
