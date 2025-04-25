package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.Questions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Questions, Long> {
}
