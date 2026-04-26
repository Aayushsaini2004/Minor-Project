package com.aihealthos.dto;

public class AiServiceRequest {

    private String symptoms;
    private Integer age;
    private String gender;
    private String additionalNotes;

    public AiServiceRequest() {
    }

    public AiServiceRequest(String symptoms, Integer age, String gender, String additionalNotes) {
        this.symptoms = symptoms;
        this.age = age;
        this.gender = gender;
        this.additionalNotes = additionalNotes;
    }

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

    public static AiServiceRequestBuilder builder() {
        return new AiServiceRequestBuilder();
    }

    public static class AiServiceRequestBuilder {
        private String symptoms;
        private Integer age;
        private String gender;
        private String additionalNotes;

        public AiServiceRequestBuilder symptoms(String symptoms) {
            this.symptoms = symptoms;
            return this;
        }

        public AiServiceRequestBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public AiServiceRequestBuilder gender(String gender) {
            this.gender = gender;
            return this;
        }

        public AiServiceRequestBuilder additionalNotes(String additionalNotes) {
            this.additionalNotes = additionalNotes;
            return this;
        }

        public AiServiceRequest build() {
            return new AiServiceRequest(symptoms, age, gender, additionalNotes);
        }
    }
}
