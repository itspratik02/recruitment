package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.*;
import com.example.Employee_recruitment_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor

public class CandidateService {
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private QualificationRepository qualificationRepository;
    
    @Autowired
    private ExperienceRepository experienceRepository;
    
    @Autowired
    private CertificateRepository certificateRepository;

    @Transactional
    public void saveQualifications(Long candidateId, List<Qualification> qualifications) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found "));
        
        qualifications.forEach(qual -> {
            qual.setCandidate(candidate);
            qualificationRepository.save(qual);
        });
    }

    @Transactional
    public void saveExperiences(Long candidateId, List<Experience> experiences) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        experiences.forEach(exp -> {
            exp.setCandidate(candidate);
            experienceRepository.save(exp);
        });
    }

    @Transactional
    public void saveCertificates(Long candidateId, List<Certificate> certificates) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        
        certificates.forEach(cert -> {
            cert.setCandidate(candidate);
            certificateRepository.save(cert);
        });
    }

    public List<Qualification> getQualifications(Long candidateId) {
        return qualificationRepository.findByCandidate_CandidateId(candidateId);
    }

    public List<Experience> getExperiences(Long candidateId) {
        return experienceRepository.findByCandidate_CandidateId(candidateId);
    }

    public List<Certificate> getCertificates(Long candidateId) {
        return certificateRepository.findByCandidate_CandidateId(candidateId);
    }

    public Candidate getCandidateProfile(Long candidateId) {
        return candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
    }

    public void updateCandidateProfile(Candidate candidate) {
        candidateRepository.save(candidate); // This will update the candidate's profile
    }




}