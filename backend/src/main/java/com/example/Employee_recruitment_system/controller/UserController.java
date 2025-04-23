package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.User;
import com.example.Employee_recruitment_system.model.ApprovalStatus;
import com.example.Employee_recruitment_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        return ResponseEntity.ok(Map.of("message",userService.register(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String role = userService.login(email, password);
        return ResponseEntity.ok(Map.of("role", role));
    }

    @PutMapping("/approve/{userId}")
    public ResponseEntity<String> approveUser(
            @PathVariable Long userId,
            @RequestParam String adminEmail) {
        String message = userService.approveUser(userId, adminEmail);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/unapproved")
    public ResponseEntity<List<User>> listUnapprovedUsers() {
        return ResponseEntity.ok(userService.getUnapprovedUsers());
    }

    @GetMapping("/pending-users")
    public ResponseEntity<List<User>> getPendingUsers() {
        return ResponseEntity.ok(userService.getPendingUsers());
    }

    @PutMapping("/update-status/{userId}")
    public ResponseEntity<String> updateApprovalStatus(
            @PathVariable Long userId,
            @RequestParam ApprovalStatus status) {
        return ResponseEntity.ok(userService.updateApprovalStatus(userId, status));
    }
}

