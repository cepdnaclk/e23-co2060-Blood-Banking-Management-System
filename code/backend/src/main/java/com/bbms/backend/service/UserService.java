package com.bbms.backend.service;

import com.bbms.backend.Repository.UserRepository;
import com.bbms.backend.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public List<User> getAll() {
        List<User> users = repo.findAll();
        users.forEach(u -> u.setPassword(null));
        return users;
    }

    public User create(User user) {

        if (repo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        validateHospital(user);

        User saved = repo.save(user);
        saved.setPassword(null);
        return saved;
    }

    public User update(Long id, User updated) {

        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(updated.getFullName());
        user.setEmail(updated.getEmail());

        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            user.setPassword(updated.getPassword());
        }

        user.setRole(updated.getRole());
        user.setStatus(updated.getStatus());
        user.setHospitalId(updated.getHospitalId());

        validateHospital(user);

        User saved = repo.save(user);
        saved.setPassword(null);
        return saved;
    }

    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        repo.deleteById(id);
    }

    // 🔥 RULE
    private void validateHospital(User user) {
        if ((user.getRole().name().equals("HOSPITAL_STAFF") ||
                user.getRole().name().equals("RECEPTION_STAFF"))
                && user.getHospitalId() == null) {

            throw new RuntimeException("Hospital required for this role");
        }
    }
}