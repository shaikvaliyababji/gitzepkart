package com.zapkart.ecommerce_backend.service;

import java.util.List;

import com.zapkart.ecommerce_backend.model.Payment;

public interface PaymentService {
    List<Payment> getAllPayments();
}