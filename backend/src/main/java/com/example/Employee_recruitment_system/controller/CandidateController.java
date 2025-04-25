package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.*;
import com.example.Employee_recruitment_system.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidate-profile")
@CrossOrigin(origins = "http://localhost:4200")
public class CandidateController {
    
    @Autowired
    private CandidateService candidateService;

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
}