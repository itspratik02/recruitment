package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.service.AssessmentUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/assessment")
//@CrossOrigin(origins = "*")
@CrossOrigin(origins = "http://localhost:4200")
public class AssessmentUploadController {

    private final AssessmentUploadService assessmentUploadService;

    public AssessmentUploadController(AssessmentUploadService assessmentUploadService) {
        this.assessmentUploadService = assessmentUploadService;
    }

    @PostMapping("/upload/{jobPostId}")
    public ResponseEntity<Map<String,String>> uploadAssessmentFile(
            @PathVariable Long jobPostId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("duration") int duration,
            @RequestParam("totalMarks") int totalMarks,
            @RequestParam("passingMarks") int passingMarks,
            @RequestParam("noOfQuestions") int noOfQuestions,
            @RequestParam("instructions") String instructions) {
        System.out.println(file.getOriginalFilename());
        System.out.println("Inside the upload file execl");
        assessmentUploadService.processExcelFile(file, jobPostId,duration,totalMarks,passingMarks,noOfQuestions,instructions);
        return ResponseEntity.ok(Map.of("res","Assessment and questions uploaded successfully"));
    }

}
