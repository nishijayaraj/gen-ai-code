package com.example.demo.dto;

public class UserDTO {
    private String fullName;
    private Integer age;
    private String email;

    public UserDTO() {}

    public UserDTO(String fullName, Integer age, String email) {
        this.fullName = fullName;
        this.age = age;
        this.email = email;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
