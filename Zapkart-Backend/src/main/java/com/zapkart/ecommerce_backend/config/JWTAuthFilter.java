package com.zapkart.ecommerce_backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.zapkart.ecommerce_backend.service.JWTManager;

import java.io.IOException;
import java.util.List;

@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTManager jwtManager;

    // Public endpoints that don't require JWT authentication
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/users/register",
            "/api/users/login",
            "/api/users/signin",
            "/api/users/verify-otp",
            "/api/users/forgot-password",
            "/api/users/reset-password",
            "/invoice/view/razorpay/*",
            "/invoice/download/razorpay/*",
            "/images/**"

    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("Requested path: " + path);

        if (PUBLIC_PATHS.contains(path)) {
            System.out.println("✅ Public endpoint. Skipping JWT check for: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String email = jwtManager.validateToken(token); // null if invalid

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Extract role from JWT claims
                String role = jwtManager.extractAllClaims(token).get("role", String.class);

                // Create authority using role
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role.toUpperCase());

                // Set authentication context
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email,
                        null, List.of(authority));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("✅ JWT validated. User authenticated: " + email + ", Role: " + role);
            }
        } else {
            System.out.println("❌ Missing or invalid Authorization header");
        }

        filterChain.doFilter(request, response);
    }
}
