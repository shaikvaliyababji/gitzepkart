package com.zapkart.ecommerce_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.zapkart.ecommerce_backend.model.Order;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.service.EmailService;
import com.zapkart.ecommerce_backend.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/add")
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order savedOrder = orderService.createOrder(order);
        // ✅ Email can go in the service layer or controller
        if (savedOrder != null) {
            User customer = savedOrder.getCustomer();
            emailService.sendHtmlInvoice(customer, savedOrder); // ✅ sends the invoice
        }
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/customer/grouped/{customerId}")
    public ResponseEntity<List<Order>> getGroupedOrders(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersGroupedByRazorpayOrderId(customerId);
        return ResponseEntity.ok(orders);
    }

    @PostMapping("/add-multiple")
    public ResponseEntity<List<Order>> createGroupedOrders(@RequestBody List<Order> orders) {
        List<Order> savedOrders = orderService.createOrders(orders);

        if (!savedOrders.isEmpty()) {
            User customer = savedOrders.get(0).getCustomer(); // assume all orders belong to same customer
            String razorpayOrderId = savedOrders.get(0).getRazorpayOrderId(); // must be same across orders
            emailService.sendGroupedInvoice(customer, savedOrders, razorpayOrderId);
        }

        return ResponseEntity.ok(savedOrders);
    }

}