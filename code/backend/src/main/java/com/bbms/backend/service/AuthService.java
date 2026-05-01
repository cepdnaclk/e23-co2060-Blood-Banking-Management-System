package com.bbms.backend.service;

import com.bbms.backend.Repository.UserRepository;
import com.bbms.backend.entity.User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepo;

    public AuthService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User login(String email, String password) {

        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOpt.get();

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        if (user.getStatus() != null &&
                user.getStatus().name().equals("INACTIVE")) {
            throw new RuntimeException("User inactive");
        }

        return user;
    }
}
