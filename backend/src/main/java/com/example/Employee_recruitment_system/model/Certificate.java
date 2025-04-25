package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonBackReference;


@Entity
@Getter @Setter
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long certificateId;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonBackReference("certificate")
    private Candidate candidate;

    private String title;
    private String issuedBy;
    private String certificateURL;

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }
}
