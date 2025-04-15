package com.example.Employee_recruitment_system.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name = "HR")
public class HR {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long HRId;

    private String name;
    private String email;
    private String phone;


}
