package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Interview_Schedule")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduleId;

    @ManyToOne
    @JoinColumn(name = "applicationId", nullable = false)
    private CandidateApplication application;

    @ManyToOne
    @JoinColumn(name = "jdId", nullable = false)
    private JobPost jobPost;

    private Long hiringTeamId;
    private LocalDate interviewDate;
    private LocalTime interviewTime;
}

