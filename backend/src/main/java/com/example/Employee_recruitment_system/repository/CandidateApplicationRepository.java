package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.CandidateApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CandidateApplicationRepository extends JpaRepository<CandidateApplication, Long> {
    long countByJobPostJdid(Long jdid);
    List<CandidateApplication> findByCandidate_CandidateId(Long candidateId);
}


