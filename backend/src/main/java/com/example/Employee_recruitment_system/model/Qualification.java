package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Getter @Setter
@Table(name = "qualifications")
public class Qualification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long educationId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonBackReference("qualification")
    private Candidate candidate;

    private String collegeName;
    private String university;
    private String degree;
    private String specialization;
    private Integer startYear;
    private Integer endYear;
    private Double percentage;
}
