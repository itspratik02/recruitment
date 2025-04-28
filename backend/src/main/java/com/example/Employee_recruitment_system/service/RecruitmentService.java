package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.Assessment;
import com.example.Employee_recruitment_system.model.Candidate;
import com.example.Employee_recruitment_system.model.Interview;
import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.repository.AssessmentRepository;
import com.example.Employee_recruitment_system.repository.CandidateRepository;
import com.example.Employee_recruitment_system.repository.InterviewRepository;
import com.example.Employee_recruitment_system.repository.JobPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecruitmentService {

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    public List<JobPost> getAllJobPosts() {
        return jobPostRepository.findAll();
    }

    public List<Candidate> getCandidatesByJobPost(Long jobPostId) {
        return candidateRepository.findByJobPostId(jobPostId);
    }

    public List<Candidate> getFreshers(List<Candidate> candidates) {
        return candidates.stream().filter(candidate -> candidate.getExperience() == 0).collect(Collectors.toList());
    }

    public List<Candidate> getLaterals(List<Candidate> candidates) {
        return candidates.stream().filter(candidate -> candidate.getExperience() > 0).collect(Collectors.toList());
    }

    public Assessment scheduleAssessment(Candidate candidate, JobPost jobPost, LocalDate date, LocalTime time) {
        Assessment assessment = Assessment.builder()
                .jd(jobPost)
                .assessmentDate(date)
                .startTime(time)
                .build();
        return assessmentRepository.save(assessment);
    }

    public Interview scheduleInterview(Candidate candidate, JobPost jobPost, LocalDate date, LocalTime time, String interviewerName) {
        Interview interview = Interview.builder()
                .candidate(candidate)
                .jobPost(jobPost)
                .interviewDate(date)
                .interviewTime(time)
                .interviewerName(interviewerName)
                .build();
        return interviewRepository.save(interview);
    }

    public List<Assessment> getScheduledAssessments() {
        return assessmentRepository.findAll();
    }

    public List<Interview> getScheduledInterviews() {
        return interviewRepository.findAll();
    }
}