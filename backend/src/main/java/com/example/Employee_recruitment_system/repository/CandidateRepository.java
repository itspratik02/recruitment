package com.example.Employee_recruitment_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Employee_recruitment_system.model.Candidate;

import java.util.Optional;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByCandidateId(Long id);
    Optional<Candidate> findByEmail(String email);
    boolean existsById(Long id);
    boolean existsByEmail(String email);
}
