package com.zapkart.ecommerce_backend.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zapkart.ecommerce_backend.model.Payment;
import com.zapkart.ecommerce_backend.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
    private PaymentRepository paymentRepository;

   

    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }
    
  
}