package com.zapkart.ecommerce_backend.service;

import java.util.List;

import com.zapkart.ecommerce_backend.model.AddToCartRequest;
import com.zapkart.ecommerce_backend.model.Cart;
import com.zapkart.ecommerce_backend.model.User;

public interface CartService {
    List<Cart> getCartItems(User customer);
    void removeFromCart(Long customerId, Long productId);
    void clearCart(Long customerId);
	Cart addToCart(Long customerId, Long productId, Integer quantity);
	void updateQuantity(Long customerId, Long productId, int quantity); 
}
