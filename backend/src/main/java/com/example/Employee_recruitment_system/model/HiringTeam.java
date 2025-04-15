package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "HIRING_TEAM")
public class HiringTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hiringTeamId;

    private String name;
    private String email;
    private String phone;


}
