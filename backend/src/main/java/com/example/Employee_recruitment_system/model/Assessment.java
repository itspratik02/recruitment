package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
<<<<<<< HEAD
=======
import java.util.Date;
>>>>>>> 8b845da959e2b53926cf3f1f3a7dbb5cf04b8ef8

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

    private int duration;
    private int totalMarks;
    private int passingMarks;
    private String instructions;
<<<<<<< HEAD

    private LocalDate assessmentDate;
    private LocalTime startTime;

=======
    private int noOfQuestions;
    private LocalDate date;
    private LocalTime startTime;
>>>>>>> 8b845da959e2b53926cf3f1f3a7dbb5cf04b8ef8
}
