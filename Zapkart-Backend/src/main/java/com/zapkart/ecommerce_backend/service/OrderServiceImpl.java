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

   

    
<<<<<<< HEAD
    
 
    
=======

    
   
>>>>>>> babji_admin
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
<<<<<<< HEAD
 
    
    
    @Override
    public List<Order> getOrdersBySellerId(Long sellerId) {
        return orderRepository.findOrdersBySellerId(sellerId);
    }

=======
   
>>>>>>> babji_admin
}
