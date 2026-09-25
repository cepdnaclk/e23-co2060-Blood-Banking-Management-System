package com.bbms.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
    }

    @Test
    void generateToken_shouldGenerateNonEmptyToken() {

        String email = "admin@test.com";

        String token = jwtService.generateToken(email);

        assertNotNull(token);
        assertFalse(token.isEmpty());
    }

    @Test
    void extractEmail_shouldReturnCorrectEmail() {

        String email = "admin@test.com";

        String token = jwtService.generateToken(email);

        String extractedEmail = jwtService.extractEmail(token);

        assertEquals(email, extractedEmail);
    }

    @Test
    void isTokenValid_shouldReturnTrueForValidTokenAndEmail() {

        String email = "admin@test.com";

        String token = jwtService.generateToken(email);

        boolean result = jwtService.isTokenValid(token, email);

        assertTrue(result);
    }

    @Test
    void isTokenValid_shouldReturnFalseForWrongEmail() {

        String token = jwtService.generateToken("admin@test.com");

        boolean result =
                jwtService.isTokenValid(token, "wrong@test.com");

        assertFalse(result);
    }

    @Test
    void extractEmail_withInvalidToken_shouldThrowException() {

        String invalidToken = "this.is.not.a.valid.jwt";

        assertThrows(
                Exception.class,
                () -> jwtService.extractEmail(invalidToken)
        );
    }
}