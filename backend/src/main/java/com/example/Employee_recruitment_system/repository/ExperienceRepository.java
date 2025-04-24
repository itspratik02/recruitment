package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByCandidate_CandidateId(Long candidateId);
}