package com.healthcenter.BBMS.backend.repository;

import com.healthcenter.BBMS.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This helps the login system find a user by their email
    Optional<User> findByEmail(String email);
}

