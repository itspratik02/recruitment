package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Setter
@Getter
public class CandidateApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne
    @JoinColumn(name = "jdid", nullable = false)
    private JobPost jobPost;

    private LocalDate applicationDate;
    private String currentStatus;
    private String progress;
    private String resumePath;

    @Override
    public String toString() {
        return "CandidateApplication{" +
                "applicationId=" + applicationId +
                ", candidate=" + (candidate != null ? candidate.getCandidateId() : "null") +
                ", jobPost=" + (jobPost != null ? jobPost.getJdid() : "null") +
                ", applicationDate=" + applicationDate +
                ", currentStatus='" + currentStatus + '\'' +
                ", progress='" + progress + '\'' +
                ", resumePath='" + resumePath + '\'' +
                '}';
    }

}
