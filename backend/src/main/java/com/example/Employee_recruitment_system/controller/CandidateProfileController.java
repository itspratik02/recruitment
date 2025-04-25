package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.Candidate;
import com.example.Employee_recruitment_system.service.CandidateProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate-profile")
@CrossOrigin(origins = "http://localhost:4200")
public class CandidateProfileController {


    @Autowired
    private CandidateProfileService candidateProfileService;



    @GetMapping("/{candidateId}/getCandidate")
    public Candidate getCandidateProfile(@PathVariable long candidateId) {
        System.out.println("\n\n\n"+candidateProfileService.getCandidateProfile(candidateId));
        return candidateProfileService.getCandidateProfile(candidateId);
    }

    @PutMapping("/candidate/profile")
    public Candidate updateCandidateProfile(@RequestBody Candidate updatedCandidate) {
        return candidateProfileService.updateCandidateProfile(updatedCandidate);
    }

}
