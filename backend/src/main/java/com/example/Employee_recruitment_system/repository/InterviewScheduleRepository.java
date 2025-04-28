package com.example.Employee_recruitment_system.repository;

import com.example.Employee_recruitment_system.model.InterviewSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewScheduleRepository extends JpaRepository<InterviewSchedule, Long> {
    List<InterviewSchedule> findByJobPostId(Long jdId);
}