package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.service.AssessmentUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*")
public class AssessmentUploadController {

    private final AssessmentUploadService assessmentUploadService;

    @Autowired
    public AssessmentUploadController(AssessmentUploadService assessmentUploadService) {
        this.assessmentUploadService = assessmentUploadService;
    }

    @PostMapping("/upload/{jobPostId}")
    public ResponseEntity<String> uploadAssessment(@RequestParam("file") MultipartFile file, @PathVariable Long jobPostId) {
        try {
            // Log the start of the file upload
            System.out.println("Uploading file for Job Post ID: " + jobPostId);

            assessmentUploadService.uploadAssessmentData(file, jobPostId);

            // Log successful upload
            return ResponseEntity.ok("Assessment uploaded successfully.");
        } catch (Exception e) {
            // Log detailed error
            System.err.println("Error during file upload: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload assessment: " + e.getMessage());
        }
    }
}
