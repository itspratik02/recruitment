package com.example.Employee_recruitment_system.controller;

import com.example.Employee_recruitment_system.model.User;
import com.example.Employee_recruitment_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") // 👈 your Angular port
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        String message = userService.register(user);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        String message = userService.login(email, password);
        return ResponseEntity.ok(message);
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
}

