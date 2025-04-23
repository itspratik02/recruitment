package com.example.Employee_recruitment_system.model;

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
    private String password;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<Qualification> qualifications;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<Experience> experiences;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL)
    private List<Certificate> certificates;
}
