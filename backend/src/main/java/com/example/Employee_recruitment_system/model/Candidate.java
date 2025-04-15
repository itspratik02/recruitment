package com.example.Employee_recruitment_system.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "CANDIDATE")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CandidateId;

    private String name;
    private String email;
    private String phone;
}
