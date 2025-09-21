package com.zapkart.ecommerce_backend.repository;

import com.zapkart.ecommerce_backend.model.Order;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByRazorpayOrderId(String razorpayOrderId);

    List<Order> findByCustomerId(Long id);

    List<Order> findByCustomerIdOrderByRazorpayOrderIdAsc(Long customerId);

    @Query("SELECT o FROM Order o WHERE o.product.sellerId = :sellerId")
    List<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId);

}
