package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;

@Entity
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long assessmentId;

    @ManyToOne
    @JoinColumn(name = "jdid", nullable = false)
    private JobPost jobPost;

    @ManyToOne
    @JoinColumn(name = "hiring_team_id", nullable = false)
    private HiringTeam hiringTeam;

    private int duration;
    private int totalMarks;
    private int passingMarks;
    private String instructions;

    // Getters and Setters
}