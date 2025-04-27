package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.*;
import com.example.Employee_recruitment_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
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

    @Autowired
    private CandidateApplicationRepository candidateApplicationRepository;

    @Autowired
    private JobPostRepository jobPostRepository; // Corrected repository injection

    @Transactional
    public void saveQualifications(Long candidateId, List<Qualification> qualifications) {
        qualificationRepository.deleteByCandidate_CandidateId(candidateId); // Delete existing records
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        qualifications.forEach(qualification -> {
            qualification.setCandidate(candidate);
            qualificationRepository.save(qualification);
        });
    }

    @Transactional
    public void saveExperiences(Long candidateId, List<Experience> experiences) {
        experienceRepository.deleteByCandidate_CandidateId(candidateId); // Delete existing records
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        experiences.forEach(experience -> {
            experience.setCandidate(candidate);
            experienceRepository.save(experience);
        });
    }

    @Transactional
    public void saveCertificates(Long candidateId, List<Certificate> certificates) {
        certificateRepository.deleteByCandidate_CandidateId(candidateId); // Delete existing records
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        certificates.forEach(certificate -> {
            certificate.setCandidate(candidate);
            certificateRepository.save(certificate);
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

    public String saveResume(MultipartFile resume) throws IOException {
        // Define the directory to save resumes
        String uploadDir = "resumes/";
        System.out.println("Checking resume"+resume.getOriginalFilename());
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            if (!directory.mkdirs()) {
                throw new IOException("Failed to create directory: " + directory.getAbsolutePath());
            }
        }

        // Log the directory path for debugging
        System.out.println("Saving resume to directory: " + directory.getAbsolutePath());

        Path filePath = Path.of(uploadDir, resume.getOriginalFilename());
        try (InputStream inputStream = resume.getInputStream()) {
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }

        return filePath.toAbsolutePath().toString();

    }

    @Transactional
    public void saveApplication(Long candidateId, Long jobId, String resumePath) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        JobPost jobPost = jobPostRepository.findById(jobId) // Corrected to use the injected repository
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        CandidateApplication application = new CandidateApplication();
        application.setCandidate(candidate);
        application.setJobPost(jobPost);
        application.setApplicationDate(LocalDate.now());
        application.setCurrentStatus("Applied");
        application.setResumePath(resumePath);

        candidateApplicationRepository.save(application);
    }
}