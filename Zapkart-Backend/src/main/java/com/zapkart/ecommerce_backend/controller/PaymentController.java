package com.zapkart.ecommerce_backend.controller;

import com.razorpay.RazorpayException;
import com.zapkart.ecommerce_backend.model.Payment;
import com.zapkart.ecommerce_backend.service.PaymentService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController	
@RequestMapping("/api/payments")
public class PaymentController {

  
    
    @Autowired
    private PaymentService paymentService;

    
    
    @GetMapping("/all")
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

}
