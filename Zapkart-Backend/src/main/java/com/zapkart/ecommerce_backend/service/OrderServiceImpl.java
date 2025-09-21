package com.zapkart.ecommerce_backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.zapkart.ecommerce_backend.model.Order;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.repository.AddressRepository;
import com.zapkart.ecommerce_backend.repository.OrderRepository;
import com.zapkart.ecommerce_backend.repository.ProductRepository;
import com.zapkart.ecommerce_backend.repository.UserRepository;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private EmailService emailService;

    public Order createOrder(Order order) {
        Long customerId = order.getCustomer().getId();
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());

        // ✅ Fetch full address from DB
        int addressId = order.getShippingAddress().getId(); // assuming addressId is `int`, cast to long if needed
        order.setShippingAddress(addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found")));

        return orderRepository.save(order);

    }

    public List<Order> createOrders(List<Order> orders) {
        List<Order> savedOrders = new ArrayList<>();

        for (Order order : orders) {
            User customer = userRepository.findById(order.getCustomer().getId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            order.setCustomer(customer);

            // ✅ Fetch full product to populate brand, model, etc.
            Long productId = order.getProduct().getProductId();
            order.setProduct(productRepository.findById(productId)
                    .orElseThrow(() -> new IllegalArgumentException("Product not found")));

            // After setting customer and product
            int addressId = order.getShippingAddress().getId();
            order.setShippingAddress(addressRepository.findById(addressId)
                    .orElseThrow(() -> new IllegalArgumentException("Address not found")));

            order.setOrderDate(LocalDateTime.now()); // set order date if needed

            savedOrders.add(orderRepository.save(order));
        }

        if (!savedOrders.isEmpty()) {
            String razorpayOrderId = savedOrders.get(0).getRazorpayOrderId();
            User customer = savedOrders.get(0).getCustomer();
            emailService.sendGroupedInvoice(customer, savedOrders, razorpayOrderId); // 🧾 one email
        }

        return savedOrders;
    }

    @Override
    public List<Order> getOrdersByCustomerId(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public List<Order> getOrdersGroupedByRazorpayOrderId(Long customerId) {
        return orderRepository.findByCustomerIdOrderByRazorpayOrderIdAsc(customerId);
    }

}
