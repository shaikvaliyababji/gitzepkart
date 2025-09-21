package com.zapkart.ecommerce_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.zapkart.ecommerce_backend.model.AddToCartRequest;
import com.zapkart.ecommerce_backend.model.Cart;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.service.CartService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody AddToCartRequest request) {
        Cart cart = cartService.addToCart(request.getCustomerId(), request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }


    // Update quantity of a product in the cart
    @PutMapping("/update")
    public ResponseEntity<String> updateQuantity(@RequestParam Long customerId,
                                                 @RequestParam Long productId,
                                                 @RequestParam int quantity) {
        try {
            cartService.updateQuantity(customerId, productId, quantity);
            return new ResponseEntity<>("Quantity updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating quantity: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // Corrected GET method using @RequestParam for customerId
    @GetMapping("/items")
    public ResponseEntity<List<Cart>> getCartItems(@RequestParam Long customerId) {
        User customer = new User();
        customer.setId(customerId);  // Set customerId to the user object
        return ResponseEntity.ok(cartService.getCartItems(customer));
    }

    @DeleteMapping("/delete")
    @Transactional
    public ResponseEntity<?> removeFromCart(
    		@RequestParam Long customerId,
            @RequestParam Long productId) {
        cartService.removeFromCart(customerId, productId);
        return ResponseEntity.ok("Removed from cart");
    }

    @DeleteMapping("/clear")
    @Transactional
    public ResponseEntity<?> clearCart(@RequestParam Long customerId) {
        cartService.clearCart(customerId);
        return ResponseEntity.ok("Cart cleared");
    }
}
