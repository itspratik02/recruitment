package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
}
