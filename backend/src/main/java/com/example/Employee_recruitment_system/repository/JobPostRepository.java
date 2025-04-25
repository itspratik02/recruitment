package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;


public interface JobPostRepository extends JpaRepository<JobPost, Long> {
}

