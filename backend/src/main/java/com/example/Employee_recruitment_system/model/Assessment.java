package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "assessment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assessment_id")
    private Long assessmentID;

    @ManyToOne
    @JoinColumn(name = "jdid", nullable = false)
    private JobPost jd;

    @ManyToOne
    @JoinColumn(name = "hiring_team_id", nullable = false)
    private HiringTeam hiringTeam;

    private int duration;
    private int totalMarks;
    private int passingMarks;
    private String instructions;

    private LocalDate assessmentDate;
    private LocalTime startTime;

}
