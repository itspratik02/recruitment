package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.*;
import com.example.Employee_recruitment_system.service.CandidateProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-profile")
@CrossOrigin(origins = "http://localhost:4200")
public class CandidateProfileController {
    
    @Autowired
    private CandidateProfileService candidateProfileService;

    @PostMapping("/{candidateId}/qualifications")
    public ResponseEntity<Void> saveQualifications(
            @PathVariable Long candidateId,
            @RequestBody List<Qualification> qualifications) {
        candidateProfileService.saveQualifications(candidateId, qualifications);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{candidateId}/experiences")
    public ResponseEntity<Void> saveExperiences(
            @PathVariable Long candidateId,
            @RequestBody List<Experience> experiences) {
        candidateProfileService.saveExperiences(candidateId, experiences);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{candidateId}/certificates")
    public ResponseEntity<Void> saveCertificates(
            @PathVariable Long candidateId,
            @RequestBody List<Certificate> certificates) {
        candidateProfileService.saveCertificates(candidateId, certificates);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{candidateId}/qualifications")
    public ResponseEntity<List<Qualification>> getQualifications(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateProfileService.getQualifications(candidateId));
    }

    @GetMapping("/{candidateId}/experiences")
    public ResponseEntity<List<Experience>> getExperiences(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateProfileService.getExperiences(candidateId));
    }

    @GetMapping("/{candidateId}/certificates")
    public ResponseEntity<List<Certificate>> getCertificates(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateProfileService.getCertificates(candidateId));
    }
}