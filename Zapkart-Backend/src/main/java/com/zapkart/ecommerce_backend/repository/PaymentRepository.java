package com.zapkart.ecommerce_backend.repository;

import com.zapkart.ecommerce_backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Additional methods if needed
}
