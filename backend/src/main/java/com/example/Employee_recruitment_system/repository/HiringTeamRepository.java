package com.example.Employee_recruitment_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Employee_recruitment_system.model.HiringTeam;

import java.util.Optional;

public interface HiringTeamRepository extends JpaRepository<HiringTeam, Long> {
    Optional<HiringTeam> findByEmail(String email);

}

