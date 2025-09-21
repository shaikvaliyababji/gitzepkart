package com.zapkart.ecommerce_backend.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.zapkart.ecommerce_backend.model.User;

public interface UserService {
	User registerUser(User user); //return type is User data(Object)
    User getUserById(Long id);
    ResponseEntity<String> ValidateCredentials(String email, String password);
   
    User updateUserProfile(String email, String newName);
    
    
    public String generateResetToken(String email);
    public String resetPassword(String token, String newPassword);
    

}
