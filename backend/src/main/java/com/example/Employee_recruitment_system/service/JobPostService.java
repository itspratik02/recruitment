package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.HiringTeam;
import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.repository.CandidateApplicationRepository;
import com.example.Employee_recruitment_system.repository.HiringTeamRepository;
import com.example.Employee_recruitment_system.repository.JobPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class JobPostService {
    @Autowired
    private JobPostRepository jobPostRepository;


    @Autowired
    private CandidateApplicationRepository applicationRepository;

    @Autowired
    private HiringTeamRepository hiringTeamRepository;

    public JobPost saveJobPost(JobPost jobPost) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String email = authentication.getName();  // Extract email from JWT
//
//
//        HiringTeam hiringTeam = hiringTeamRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Hiring team not found"+email));

//        jobPost.setHiringTeam(hiringTeam);
        jobPost.setPostDate(LocalDate.now());

        return jobPostRepository.save(jobPost);
    }




    public List<JobPost> getAllJobPosts() {
        return jobPostRepository.findAll();
    }

    public void deleteJobPost(Long jdid) {
        jobPostRepository.deleteById(jdid);
    }


    public List<JobPost> getAllAvailableJobPosts() {
        List<JobPost> jobPosts = jobPostRepository.findAll();

        for (JobPost post : jobPosts) {
            // Count how many candidates applied
            long count = applicationRepository.countByJobPostJdid(post.getJdid());
            post.setAppliedCount(count);

        }

        return jobPosts;
    }

}