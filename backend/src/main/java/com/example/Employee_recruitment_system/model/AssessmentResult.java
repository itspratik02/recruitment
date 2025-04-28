package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "AssessmentResult")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resultId;

    @ManyToOne
    @JoinColumn(name = "applicationId", nullable = false)
    private CandidateApplication application;

    @ManyToOne
    @JoinColumn(name = "assessmentId", nullable = false)
    private Assessment assessment;

    private int score;
    private LocalDate attemptDate;
    private String resultStatus; // (Scheduled, Passed, Failed)
}

