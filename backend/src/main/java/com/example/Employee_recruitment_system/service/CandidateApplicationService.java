package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.CandidateApplication;
import com.example.Employee_recruitment_system.repository.CandidateApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CandidateApplicationService {
    
    @Autowired
    private CandidateApplicationRepository candidateApplicationRepository;

    public List<CandidateApplication> getApplicationsByCandidateId(Long candidateId) {
        return candidateApplicationRepository.findByCandidate_CandidateId(candidateId);
    }
}
