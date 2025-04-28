package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
}