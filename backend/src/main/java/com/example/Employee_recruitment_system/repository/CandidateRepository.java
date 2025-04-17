package com.example.Employee_recruitment_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Employee_recruitment_system.model.Candidate;

@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    // Additional methods specific to Candidate can be defined here if needed
    
}
