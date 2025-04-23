package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long jdid;

    @ManyToOne
    @JoinColumn(name = "hiring_team_id", nullable = false)
    private HiringTeam hiringTeam;

    private String title;
    @Lob
   @Column(length = 10000)
    private String responsibilities;
    private String description;
    private String requirements;
    private String location;
    private int experienceRequired;
    private LocalDate postDate;
    private LocalDate applicationDeadline;

    @Transient
    private long appliedCount;



}