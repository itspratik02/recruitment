package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {
}

