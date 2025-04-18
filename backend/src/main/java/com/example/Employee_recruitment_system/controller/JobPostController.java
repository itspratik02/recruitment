package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobposts")

public class JobPostController {
    @Autowired
    private JobPostService jobPostService;

    @PostMapping
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost) {
        return new ResponseEntity<>(jobPostService.saveJobPost(jobPost), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<JobPost>> getAllJobPosts() {
        return new ResponseEntity<>(jobPostService.getAllJobPosts(), HttpStatus.OK);
    }

    @GetMapping("/team/{hiringTeamId}")
    public ResponseEntity<List<Map<String, Object>>> getPostsByHiringTeam(@PathVariable Long hiringTeamId) {
        List<Map<String, Object>> posts = jobPostService.getAllJobPostsForTeam(hiringTeamId);
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{jdid}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jdid) {
        jobPostService.deleteJobPost(jdid);
        return ResponseEntity.ok().build();
    }
}

