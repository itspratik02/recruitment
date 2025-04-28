package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.CandidateApplication;
import com.example.Employee_recruitment_system.model.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import java.util.List;

public interface CandidateApplicationRepository extends JpaRepository<CandidateApplication, Long> {
    long countByJobPostJdid(Long jdid);
<<<<<<< HEAD
    List<CandidateApplication> findByJobPost(JobPost jobPost);
    List<CandidateApplication> findByJobPostAndStatus(JobPost jobPost, String status);
    List<CandidateApplication> findByJobPostId(Long jobPostId);


=======
    List<CandidateApplication> findByCandidate_CandidateId(Long candidateId);
>>>>>>> 8b845da959e2b53926cf3f1f3a7dbb5cf04b8ef8
}


