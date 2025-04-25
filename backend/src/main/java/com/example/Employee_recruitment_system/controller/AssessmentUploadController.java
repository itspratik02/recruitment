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

    public AssessmentUploadController(AssessmentUploadService assessmentUploadService) {
        this.assessmentUploadService = assessmentUploadService;
    }

    @PostMapping("/upload/{jobPostId}")
    public ResponseEntity<String> uploadAssessmentFile(
            @PathVariable Long jobPostId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("hiringTeamEmail") String hiringTeamEmail) {

        assessmentUploadService.processExcelFile(file, jobPostId, hiringTeamEmail);
        return ResponseEntity.ok("Assessment and questions uploaded successfully");
    }

}
