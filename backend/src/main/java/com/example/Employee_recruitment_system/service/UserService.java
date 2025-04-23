package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.ApprovalStatus;
import com.example.Employee_recruitment_system.model.User;
import com.example.Employee_recruitment_system.model.UserRole;
import com.example.Employee_recruitment_system.model.HR;
import com.example.Employee_recruitment_system.model.Candidate;
import com.example.Employee_recruitment_system.model.HiringTeam;
import com.example.Employee_recruitment_system.repository.UserRepository;
import com.example.Employee_recruitment_system.repository.HRRepository;
import com.example.Employee_recruitment_system.repository.CandidateRepository;
import com.example.Employee_recruitment_system.repository.HiringTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired  
    private HRRepository hrRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private HiringTeamRepository hiringTeamRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered";
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getUserType() == UserRole.CANDIDATE) {
            Candidate candidate = new Candidate();
            candidate.setFullName(user.getName()); // Use the name field from User
            candidate.setEmail(user.getEmail());
            candidate.setPhone("DefaultPhone"); // Placeholder
            Candidate savedCandidate = candidateRepository.save(candidate);
            user.setReferenceId(savedCandidate.getCandidateId());
            user.setIsApproved(ApprovalStatus.APPROVED);
        } else if (user.getUserType() == UserRole.HR) {
            HR hr = new HR();
            hr.setName(user.getName()); // Use the name field from User
            hr.setEmail(user.getEmail());
            hr.setPhone("DefaultPhone"); // Placeholder
            HR savedHR = hrRepository.save(hr);
            user.setReferenceId(savedHR.getHRId());
            user.setIsApproved(ApprovalStatus.PENDING);
        } else if (user.getUserType() == UserRole.HIRING_TEAM) {
            HiringTeam hiringTeam = new HiringTeam();
            hiringTeam.setName(user.getName()); // Use the name field from User
            hiringTeam.setEmail(user.getEmail());
            hiringTeam.setPhone("DefaultPhone"); // Placeholder
            HiringTeam savedHiringTeam = hiringTeamRepository.save(hiringTeam);
            user.setReferenceId(savedHiringTeam.getHiringTeamId());
            user.setIsApproved(ApprovalStatus.PENDING);
        }

        userRepository.save(user);
        return "Registration successful." + (user.getIsApproved() == ApprovalStatus.PENDING ? " Awaiting admin approval." : "");
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (user.getIsApproved() == ApprovalStatus.PENDING) {
            return "User not approved by admin yet.";
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid credentials";
        }

        return  ""+user.getUserType();
    }

    public String approveUser(Long userId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail).orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getUserType() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can approve users");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsApproved(ApprovalStatus.APPROVED);
        userRepository.save(user);
        return "User approved successfully.";
    }

    public List<User> getUnapprovedUsers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getIsApproved() == ApprovalStatus.PENDING)
                .collect(Collectors.toList());
    }

    public List<User> getPendingUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getIsApproved() == ApprovalStatus.PENDING)
                .collect(Collectors.toList());
    }

    public String updateApprovalStatus(Long userId, ApprovalStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsApproved(status);
        userRepository.save(user);
        return "User status updated to " + status;
    }
}
