package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.AssessmentResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssessmentResultRepository extends JpaRepository<AssessmentResult, Long> {
    List<AssessmentResult> findByJobPostId(Long jdId);
}
