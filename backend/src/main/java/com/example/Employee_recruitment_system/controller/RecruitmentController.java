package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.Assessment;
import com.example.Employee_recruitment_system.model.Candidate;
import com.example.Employee_recruitment_system.model.Interview;
import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.service.RecruitmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/recruitment")
public class RecruitmentController {

    @Autowired
    private RecruitmentService recruitmentService;

    @GetMapping("/job-posts")
    public List<JobPost> getAllJobPosts() {
        return recruitmentService.getAllJobPosts();
    }

    @GetMapping("/candidates/{jobPostId}")
    public List<Candidate> getCandidatesByJobPost(@PathVariable Long jobPostId) {
        return recruitmentService.getCandidatesByJobPost(jobPostId);
    }

    @PostMapping("/schedule-assessment")
    public Assessment scheduleAssessment(@RequestParam Long candidateId, @RequestParam Long jobPostId,
                                          @RequestParam String date, @RequestParam String time) {
        Candidate candidate = new Candidate(); // Fetch candidate by ID (to be implemented)
        JobPost jobPost = new JobPost(); // Fetch job post by ID (to be implemented)
        return recruitmentService.scheduleAssessment(candidate, jobPost, LocalDate.parse(date), LocalTime.parse(time));
    }

    @PostMapping("/schedule-interview")
    public Interview scheduleInterview(@RequestParam Long candidateId, @RequestParam Long jobPostId,
                                        @RequestParam String date, @RequestParam String time,
                                        @RequestParam String interviewerName) {
        Candidate candidate = new Candidate(); // Fetch candidate by ID (to be implemented)
        JobPost jobPost = new JobPost(); // Fetch job post by ID (to be implemented)
        return recruitmentService.scheduleInterview(candidate, jobPost, LocalDate.parse(date), LocalTime.parse(time), interviewerName);
    }

    @GetMapping("/scheduled-assessments")
    public List<Assessment> getScheduledAssessments() {
        return recruitmentService.getScheduledAssessments();
    }

    @GetMapping("/scheduled-interviews")
    public List<Interview> getScheduledInterviews() {
        return recruitmentService.getScheduledInterviews();
    }
}