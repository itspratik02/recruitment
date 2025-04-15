package com.example.Employee_recruitment_system.service;

import com.example.Employee_recruitment_system.model.User;
import com.example.Employee_recruitment_system.model.UserRole;
import com.example.Employee_recruitment_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        user.setIsApproved(user.getRole() == UserRole.ADMIN); // Auto-approve Admin
        userRepository.save(user);
        return "Registration successful. Awaiting admin approval.";
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
//
//        if (!user.isApproved()) {
//            return "User not approved by admin yet.";
//        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Invalid credentials";
        }

        return "Login successful for role: " + user.getRole();
    }

    public String approveUser(Long userId, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Only admins can approve users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

//        user.setApproved(true);
        userRepository.save(user);
        return "User approved successfully.";
    }

//    public List<User> getUnapprovedUsers() {
////        return userRepository.findAll().stream()
////                .filter(u -> !u.isApproved())
////                .collect(Collectors.toList());
//    }
}
