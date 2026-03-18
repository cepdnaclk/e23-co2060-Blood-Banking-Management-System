package com.healthcenter.BBMS.backend.controller;

import com.healthcenter.BBMS.backend.entity.Role;
import com.healthcenter.BBMS.backend.entity.User;
import com.healthcenter.BBMS.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Create a new Staff or Admin user
    @PostMapping
    public String createUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Error: Email already exists!";
        }

        // Encrypt the plain text password from the request
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setCreatedAt(LocalDateTime.now());

        if (user.getRole() == null) {
            user.setRole(Role.STAFF);
        }

        userRepository.save(user);
        return "User created successfully with role: " + user.getRole();
    }

    // List all users for the Admin to see
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
