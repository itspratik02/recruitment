package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Getter @Setter
@Table(name = "experiences")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long experienceId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonBackReference("experience")
    private Candidate candidate;




    private String companyName;
    private String role;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }
}
