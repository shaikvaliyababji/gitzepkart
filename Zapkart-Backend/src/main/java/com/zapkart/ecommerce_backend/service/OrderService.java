package com.zapkart.ecommerce_backend.service;

import java.util.List;

import com.zapkart.ecommerce_backend.model.Order;

public interface OrderService {
    Order createOrder(Order order);

    List<Order> getOrdersByCustomerId(Long customerId);

    List<Order> getOrdersGroupedByRazorpayOrderId(Long customerId);

    List<Order> createOrders(List<Order> orders);

}
