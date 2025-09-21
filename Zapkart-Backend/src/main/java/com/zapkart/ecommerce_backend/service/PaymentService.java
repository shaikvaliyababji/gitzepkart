package com.zapkart.ecommerce_backend.service;


import com.zapkart.ecommerce_backend.model.Payment;

public interface PaymentService {
    Payment createPayment(Payment payment);
}