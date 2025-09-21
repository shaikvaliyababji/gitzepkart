package com.zapkart.ecommerce_backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/dashboard")
    public String customerDashboard() {
        return "Welcome, Customer!";
    }
}
