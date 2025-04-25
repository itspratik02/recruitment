package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.Candidate;
import com.example.Employee_recruitment_system.model.Certificate;
import com.example.Employee_recruitment_system.model.Experience;
import com.example.Employee_recruitment_system.model.Qualification;
import com.example.Employee_recruitment_system.repository.CandidateRepository;
import com.example.Employee_recruitment_system.repository.CertificateRepository;
import com.example.Employee_recruitment_system.repository.ExperienceRepository;
import com.example.Employee_recruitment_system.repository.QualificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CandidateProfileService {
    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private QualificationRepository qualificationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Autowired
    private CertificateRepository certificateRepository;


    public Candidate getCandidateProfile(Long candidateId) {
        // Assuming the username (email) is used for login
//        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
    }

    public Candidate updateCandidateProfile(Candidate updatedCandidate) {
        // Fetching the current logged-in candidate by email (using Spring Security)
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Candidate candidate = candidateRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Updating the basic information of the candidate
        candidate.setFullName(updatedCandidate.getFullName());
        candidate.setEmail(updatedCandidate.getEmail());
        candidate.setPhone(updatedCandidate.getPhone());

        // Adding new qualifications, experiences, and certificates
        if (updatedCandidate.getQualifications() != null) {
            for (Qualification qualification : updatedCandidate.getQualifications()) {
                qualification.setCandidate(candidate); // Ensuring proper mapping
            }
            candidate.getQualifications().addAll(updatedCandidate.getQualifications());
        }

        if (updatedCandidate.getExperiences() != null) {
            for (Experience experience : updatedCandidate.getExperiences()) {
                experience.setCandidate(candidate); // Ensuring proper mapping
            }
            candidate.getExperiences().addAll(updatedCandidate.getExperiences());
        }

        if (updatedCandidate.getCertificates() != null) {
            for (Certificate certificate : updatedCandidate.getCertificates()) {
                certificate.setCandidate(candidate); // Ensuring proper mapping
            }
            candidate.getCertificates().addAll(updatedCandidate.getCertificates());
        }

        // Saving the updated candidate, which will cascade the changes to related entities
        return candidateRepository.save(candidate);
    }


}
