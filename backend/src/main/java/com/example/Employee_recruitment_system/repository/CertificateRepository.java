package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    List<Certificate> findByCandidateCandidateId(Long candidateId);
}