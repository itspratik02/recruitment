package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.CandidateApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateApplicationRepository extends JpaRepository<CandidateApplication, Long> {
    long countByJobPostJdid(Long jdid);
}


