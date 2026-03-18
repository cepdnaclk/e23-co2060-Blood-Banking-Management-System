package com.healthcenter.BBMS.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // This allows Postman to send POST requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/**").permitAll()
                        .requestMatchers("/api/management/**").permitAll()
                        .anyRequest().permitAll() // This TEMPORARILY opens all doors for testing
                );
        return http.build();
    }
}
