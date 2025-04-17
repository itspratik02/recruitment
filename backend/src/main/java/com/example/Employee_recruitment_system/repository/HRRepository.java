package com.example.Employee_recruitment_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Employee_recruitment_system.model.HR;

@Repository
public interface HRRepository extends JpaRepository<HR, Long> {
    // Additional methods specific to HR can be defined here if needed
    
}
