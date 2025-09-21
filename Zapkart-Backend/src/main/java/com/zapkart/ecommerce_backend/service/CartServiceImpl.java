package com.zapkart.ecommerce_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zapkart.ecommerce_backend.model.AddToCartRequest;
import com.zapkart.ecommerce_backend.model.Cart;
import com.zapkart.ecommerce_backend.model.Product;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.repository.CartRepository;
import com.zapkart.ecommerce_backend.repository.ProductRepository;
import com.zapkart.ecommerce_backend.repository.UserRepository;
import com.zapkart.ecommerce_backend.service.CartService;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Cart addToCart(Long customerId, Long productId, Integer quantity) {
        User customer = userRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = new Cart();
        cart.setCustomer(customer);
        cart.setProduct(product);
        cart.setQuantity(quantity);

        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getCartItems(User customer) {
        return cartRepository.findByCustomer(customer);
    }

    @Override
    public void removeFromCart(Long customerId, Long productId) {
        Cart cartItem = cartRepository.findByCustomerIdAndProduct_ProductId(customerId, productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        cartRepository.delete(cartItem);
    }


    @Override
    public void clearCart(Long customerId) {
        cartRepository.deleteByCustomerId(customerId);
    }
    

    // Update the quantity of a product in the cart
    public void updateQuantity(Long customerId, Long productId, int quantity) {
        // Retrieve the cart item for the specific customer and product
        Cart cartItem = cartRepository.findByCustomerIdAndProduct_ProductId(customerId, productId)
                                          .orElseThrow(() -> new RuntimeException("Item not found"));

        // Update the quantity
        cartItem.setQuantity(quantity);

        // Save the updated cart item
        cartRepository.save(cartItem);
    }
}
