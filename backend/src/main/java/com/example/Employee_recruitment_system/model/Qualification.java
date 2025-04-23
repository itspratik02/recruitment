package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "qualifications")
public class Qualification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long educationId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    private Candidate candidate;

    private String collegeName;
    private String university;
    private String degree;
    private String specialization;
    private Integer startYear;
    private Integer endYear;
    private Double percentage;
}
