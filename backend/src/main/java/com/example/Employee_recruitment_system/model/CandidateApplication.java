package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class CandidateApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jdid", nullable = false)
    private JobPost jd;



    private LocalDate applicationDate;
    private String currentStatus;
    private String progress;
    private String resumePath;

    @ManyToOne
    private JobPost jobPost;

}
