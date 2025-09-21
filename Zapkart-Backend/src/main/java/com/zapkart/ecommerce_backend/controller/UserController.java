package com.zapkart.ecommerce_backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import com.zapkart.ecommerce_backend.model.Product;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import com.zapkart.ecommerce_backend.repository.UserRepository;
import com.zapkart.ecommerce_backend.service.EmailService;
import com.zapkart.ecommerce_backend.service.JWTManager;

@CrossOrigin(
	    origins = "http://localhost:5173"
	)
@RestController 
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JWTManager jwtManager;
    
    @Autowired
    private EmailService emailService;
    

    @Autowired
    private UserRepository userRepository;
    
    public static String uploadDirectory=System.getProperty("user.dir")+"/src/main/resources/static/images";
    


    @PostMapping("/register")
    public ResponseEntity<User> register(@ModelAttribute User user, @RequestParam("image") MultipartFile file) throws IOException {
        String OriginalFileName = file.getOriginalFilename();
        Path fileNameandPath = Paths.get(uploadDirectory, OriginalFileName);
        Files.write(fileNameandPath, file.getBytes());
        user.setProfileImage(OriginalFileName);

        // generate OTP
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(otp);
        user.setVerified(false);  // newly registered user must verify

        User savedUser = userService.registerUser(user);

        // send OTP to email
        emailService.sendEmail(
            savedUser.getEmail(),
            "ZapKart Email Verification",
            "Welcome to ZapKart! Your OTP is: " + savedUser.getOtp()
        );

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
    
    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (user.isVerified()) {
            return ResponseEntity.badRequest().body("User is already verified.");
        }

        // generate new OTP
        String newOtp = String.format("%06d", new Random().nextInt(999999));
        user.setOtp(newOtp);
        userRepository.save(user);

        // resend OTP email
        emailService.sendEmail(
            user.getEmail(),
            "ZapKart Email Verification - Resend OTP",
            "Your new OTP is: " + newOtp
        );

        return ResponseEntity.ok("Verification email resent successfully.");
    }

    
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (user.isVerified()) {
            return ResponseEntity.ok("User already verified!");
        }

        if (user.getOtp().equals(otp)) {
            user.setVerified(true);
            user.setOtp(null); // optional: clear otp
            userRepository.save(user);
            return ResponseEntity.ok("Email verified successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP, please try again.");
        }
    }



    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
    	return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }
    @PostMapping("/signin")
    public ResponseEntity<String> login(@RequestBody User u) {
        return userService.ValidateCredentials(u.getEmail(), u.getPassword());
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        User existingUser = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
            // Optional: Re-encode password here if using Spring Security
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }

        User savedUser = userRepository.save(existingUser);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    
 // Delete product - Accessible to ADMIN only
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/secure")
    public ResponseEntity<String> securedEndpoint() {
        return ResponseEntity.ok("✅ You have accessed a secured endpoint!");
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtManager.validateToken(token);
        User user = userRepository.findByEmail(email).orElse(null);
        return ResponseEntity.ok(user);
    }
 


    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/orders")
    public ResponseEntity<String> getMyOrders() {
        // You can later fetch real orders from DB
        return ResponseEntity.ok("Here are your orders, dear customer!");
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/dashboard")
    public ResponseEntity<String> adminDashboard() {
        return ResponseEntity.ok("Admin content");
    }
    @PreAuthorize("hasRole('SELLER')")
    @GetMapping("/seller/products")
    public ResponseEntity<String> sellerView() {
        return ResponseEntity.ok("Seller content");
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
      String result = userService.generateResetToken(email);
      if (result.equals("Buyer not found!")) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
      }
      return ResponseEntity.ok(result);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
      String result = userService.resetPassword(token, newPassword);
      if (result.equals("Invalid token!")) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
      }
      return ResponseEntity.ok(result);
    }

    
    @PutMapping("/updateprofile")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedData, HttpServletRequest request) {
        String token = request.getHeader("Authorization").substring(7);
        String email = jwtManager.validateToken(token);

        User updatedUser = userService.updateUserProfile(email, updatedData.getName());
        if (updatedUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(updatedUser);
    }
    
    @GetMapping("/customercount")
    public ResponseEntity<Long> getCustomerCount()
    {
        long count = userService.displaycustomercount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/sellercount")
    public ResponseEntity<Long> getSellerCount()
    {
        long count = userService.displaysellercount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/admincount")
    public ResponseEntity<Long> getAdminCount()
    {
        long count = userService.displayadmincount();
        return ResponseEntity.ok(count);
    }


}

