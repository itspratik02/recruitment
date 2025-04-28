package com.example.Employee_recruitment_system.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "candidates")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long candidateId;

    private String fullName;
    private String email;
    private String phone;
    private int experience;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    @JsonManagedReference("qualification")
    private List<Qualification> qualifications;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    @JsonManagedReference("experience")
    private List<Experience> experiences;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    @JsonManagedReference("certificate")
    private List<Certificate> certificates;


    public String toString() {
        return "Candidate{" +
                "candidateId=" + candidateId +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' + '}';

    }
}
