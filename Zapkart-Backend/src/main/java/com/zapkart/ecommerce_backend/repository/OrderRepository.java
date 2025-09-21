package com.zapkart.ecommerce_backend.repository;

import com.zapkart.ecommerce_backend.model.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findByCustomerId(Long id);
    List<Order> findByCustomerIdOrderByRazorpayOrderIdAsc(Long customerId);

}
