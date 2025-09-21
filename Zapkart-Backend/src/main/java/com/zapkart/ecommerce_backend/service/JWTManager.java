package com.zapkart.ecommerce_backend.service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTManager {

    private static final String SEC_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEF"; // at least 32 bytes
    private final SecretKey key = Keys.hmacShaKeyFor(SEC_KEY.getBytes());

    // ✅ Generate JWT with email and role
    public String generateToken(String email, String role) {
        Map<String, String> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key)
                .compact();
    }

    // ✅ Extract only email for lightweight validation
    public String validateToken(String token) {
        try {
            return extractAllClaims(token).get("email", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ Extract full claims — used in JWTAuthFilter to get role
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Optional utility (already included by you)
    public String extractRole(String token) {
        try {
            return extractAllClaims(token).get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}
