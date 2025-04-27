package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.Candidate;
import com.example.Employee_recruitment_system.model.Qualification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QualificationRepository extends JpaRepository<Qualification, Long> {
    List<Qualification> findByCandidate_CandidateId(Long candidateId);
    void deleteByCandidate_CandidateId(Long candidateId);
}