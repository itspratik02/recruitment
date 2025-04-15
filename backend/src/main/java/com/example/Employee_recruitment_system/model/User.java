package com.example.Employee_recruitment_system.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long authId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role; // Enum: ADMIN, HR, HIRING_TEAM, CANDIDATE

    private Long referenceId; // ID of HR, Candidate, HiringTeam, etc.

    private ApprovalStatus isApproved = ApprovalStatus.PENDING;

    // Getters and Setters
}
