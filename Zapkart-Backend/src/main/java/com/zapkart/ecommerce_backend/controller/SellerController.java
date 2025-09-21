package com.zapkart.ecommerce_backend.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    @PreAuthorize("hasRole('SELLER')")
    @GetMapping("/dashboard")
    public String sellerDashboard() {
        return "Welcome, Seller!";
    }
}
