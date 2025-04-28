package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.CandidateApplication;
import com.example.Employee_recruitment_system.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateApplicationRepository extends JpaRepository<CandidateApplication, Long> {
    long countByJobPostJdid(Long jdid);
    List<CandidateApplication> findByJobPost(JobPost jobPost);
    List<CandidateApplication> findByJobPostAndStatus(JobPost jobPost, String status);
    List<CandidateApplication> findByJobPostId(Long jobPostId);


}


