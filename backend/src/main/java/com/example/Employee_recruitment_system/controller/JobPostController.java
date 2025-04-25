package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.JobPost;
import com.example.Employee_recruitment_system.service.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobposts")

public class JobPostController {
    @Autowired
    private JobPostService jobPostService;

    @PostMapping("/{email}/createjobposts")
    public ResponseEntity<JobPost> createJobPost(@RequestBody JobPost jobPost, @PathVariable String email) {
        System.out.println("JobPost Saved");
        JobPost saved = jobPostService.saveJobPost(jobPost,email);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }


    @GetMapping("/getposts")
    public ResponseEntity<List<JobPost>> getAllJobPosts() {
        return new ResponseEntity<>(jobPostService.getAllJobPosts(), HttpStatus.OK);
    }

    @GetMapping("/team/{hiringTeamId}")
    public ResponseEntity<List<JobPost>> getPostsByHiringTeam(@PathVariable Long hiringTeamId) {
        List<JobPost> posts = jobPostService.getAllAvailableJobPosts();
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{jdid}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jdid) {
        jobPostService.deleteJobPost(jdid);
        return ResponseEntity.ok().build();
    }
}

