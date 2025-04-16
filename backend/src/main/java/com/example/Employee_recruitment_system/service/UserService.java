package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.ApprovalStatus;
import com.example.Employee_recruitment_system.model.User;
import com.example.Employee_recruitment_system.model.UserRole;
import com.example.Employee_recruitment_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private String password;

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        user.setPassword(user.getPassword());
        if (user.getUserType() == UserRole.CANDIDATE ) {
            user.setIsApproved(ApprovalStatus.APPROVED);
        } else {
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

        if (!password.equals(user.getPassword())) {
            return "Invalid credentials";
        }

        return "Login successful for role: " + user.getUserType();
    }

    public String approveUser(Long userId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getUserType() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can approve users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsApproved(ApprovalStatus.APPROVED);
        userRepository.save(user);
        return "User approved successfully.";
    }

    public List<User> getUnapprovedUsers() {
        return userRepository.findAll().stream()
                .filter(u -> u.getIsApproved() == ApprovalStatus.PENDING)
                .collect(Collectors.toList());
    }
}
