package com.bbms.backend.service;

import com.bbms.backend.Repository.UserRepository;
import com.bbms.backend.entity.Role;
import com.bbms.backend.entity.User;
import com.bbms.backend.entity.UserStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    void createValidUser_shouldHashPasswordAndSaveSuccessfully() {

        User user = new User();

        user.setFullName("Test Admin");
        user.setEmail("admin@test.com");
        user.setPassword("password123");
        user.setRole(Role.ADMIN);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.empty());

        when(passwordEncoder.encode("password123"))
                .thenReturn("hashedPassword");

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.create(user);

        assertNotNull(result);
        assertEquals("admin@test.com", result.getEmail());

        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(user);

        // Password should be hidden before returning the user
        assertNull(result.getPassword());
    }

    @Test
    void createDuplicateEmail_shouldThrowException() {

        User user = new User();

        user.setFullName("Test User");
        user.setEmail("existing@test.com");
        user.setPassword("password123");
        user.setRole(Role.ADMIN);
        user.setStatus(UserStatus.ACTIVE);

        when(userRepository.findByEmail("existing@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.create(user)
        );

        assertEquals(
                "Email already exists",
                exception.getMessage()
        );

        verify(userRepository, never()).save(any(User.class));
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void createHospitalStaffWithoutHospital_shouldThrowException() {

        User user = new User();

        user.setFullName("Hospital Staff");
        user.setEmail("staff@test.com");
        user.setPassword("password123");
        user.setRole(Role.HOSPITAL_STAFF);
        user.setStatus(UserStatus.ACTIVE);
        user.setHospitalId(null);

        when(userRepository.findByEmail("staff@test.com"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.create(user)
        );

        assertEquals(
                "Hospital required for this role",
                exception.getMessage()
        );

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getAllUsers_shouldHidePasswords() {

        User user1 = new User();
        user1.setFullName("User One");
        user1.setEmail("user1@test.com");
        user1.setPassword("hashedPassword1");

        User user2 = new User();
        user2.setFullName("User Two");
        user2.setEmail("user2@test.com");
        user2.setPassword("hashedPassword2");

        when(userRepository.findAll())
                .thenReturn(Arrays.asList(user1, user2));

        List<User> result = userService.getAll();

        assertEquals(2, result.size());

        assertNull(result.get(0).getPassword());
        assertNull(result.get(1).getPassword());

        verify(userRepository).findAll();
    }

    @Test
    void deleteExistingUser_shouldDeleteSuccessfully() {

        Long userId = 1L;

        when(userRepository.existsById(userId))
                .thenReturn(true);

        userService.delete(userId);

        verify(userRepository).existsById(userId);
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteNonExistingUser_shouldThrowException() {

        Long userId = 999L;

        when(userRepository.existsById(userId))
                .thenReturn(false);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userService.delete(userId)
        );

        assertEquals(
                "User not found",
                exception.getMessage()
        );

        verify(userRepository, never()).deleteById(userId);
    }
}