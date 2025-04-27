package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.*;
import com.example.Employee_recruitment_system.repository.CandidateRepository;
import com.example.Employee_recruitment_system.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidate-profile")
@CrossOrigin(origins = "http://localhost:4200")
public class CandidateController {
    
    @Autowired
    private CandidateService candidateService;
    @Autowired
    private JavaMailSender mailSender;


    
    @PostMapping("/{candidateId}/qualifications")
    public ResponseEntity<Void> saveQualifications(
            @PathVariable Long candidateId,
            @RequestBody List<Qualification> qualifications) {
        candidateService.saveQualifications(candidateId, qualifications);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{candidateId}/experiences")
    public ResponseEntity<Void> saveExperiences(
            @PathVariable Long candidateId,
            @RequestBody List<Experience> experiences) {
        candidateService.saveExperiences(candidateId, experiences);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{candidateId}/certificates")
    public ResponseEntity<Void> saveCertificates(
            @PathVariable Long candidateId,
            @RequestBody List<Certificate> certificates) {
        candidateService.saveCertificates(candidateId, certificates);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{candidateId}/qualifications")
    public ResponseEntity<List<Qualification>> getQualifications(@PathVariable Long candidateId) {
        System.out.println(candidateService.getQualifications(candidateId));
        return ResponseEntity.ok(candidateService.getQualifications(candidateId));
    }

    @GetMapping("/{candidateId}/experiences")
    public ResponseEntity<List<Experience>> getExperiences(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateService.getExperiences(candidateId));
    }

    @GetMapping("/{candidateId}/certificates")
    public ResponseEntity<List<Certificate>> getCertificates(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateService.getCertificates(candidateId));
    }

    @PostMapping("/applications/apply")
    public ResponseEntity<Map<String, String>> applyForJob(
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("jobId") Long jobId,
            @RequestParam("candidateId") Long candidateId) {
        try {
            // Log input parameters
            System.out.println("Applying for job: " + jobId + " by candidate: " + candidateId);
            System.out.println("Resume file: " + resume.getOriginalFilename());
            
            // Save the resume file to a directory
//            String resumePath = candidateService.saveResume(resume);

            // Save the application details
//            candidateService.saveApplication(candidateId, jobId, resumePath);

            // Log success
            System.out.println("Application submitted successfully.");
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("placementfor4you@gmail.com");
            message.setTo(candidateService.getCandidateProfile(candidateId).getEmail());  // dynamic candidate email
            message.setSubject("Job Application Submitted Successfully");
            message.setText("Dear "+candidateService.getCandidateProfile(candidateId).getFullName()+",\n\nYou have successfully applied for Job ID: " + jobId  + ".\n\nFuther details will be shared soon.\n\nThank you!");

            mailSender.send(message);
            System.out.println("Mail sent successfully!");

            return ResponseEntity.ok(Map.of("res", "\"Application submitted successfully.\""));
        } catch (Exception e) {
            // Log the error
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of( "res","Failed to submit application: " + e.getMessage()));
        }
    }
}