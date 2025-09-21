package com.zapkart.ecommerce_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zapkart.ecommerce_backend.model.Cart;
import com.zapkart.ecommerce_backend.model.User;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByCustomer(User customer);
  
    void deleteByCustomerId(Long customerId);
    Optional<Cart> findByCustomerIdAndProduct_ProductId(Long customerId, Long productId);
}
