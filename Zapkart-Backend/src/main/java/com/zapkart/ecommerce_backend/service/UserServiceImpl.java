package com.zapkart.ecommerce_backend.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.zapkart.ecommerce_backend.model.EmailDetails;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTManager jwtManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Override
    public User registerUser(User user) {
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        // ✅ Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public ResponseEntity<String> ValidateCredentials(String email, String rawPassword) {
        User user = userRepository.findByEmail(email).orElse(null);

        // ✅ Check password securely
        if (user != null && passwordEncoder.matches(rawPassword, user.getPassword())) {
            String token = jwtManager.generateToken(email, user.getRole());
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public String generateResetToken(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return "Seller not found!";
        }

        User user = userOpt.get();
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + resetToken;

        EmailDetails mail = new EmailDetails();
        mail.setRecipient(email);
        mail.setSubject("🔐 Reset Your Password - Zapkart Support Team");

        String htmlContent = "<h3>Hello from <span style='color:#2563EB;'>Zapkart-Your Shopping expert</span> 👋</h3>"
                + "<p>We received a request to reset your password.</p>"
                + "<p><a href=\"" + resetLink + "\" "
                + "style='padding:10px 20px; background-color:#2563EB; color:white; text-decoration:none; border-radius:5px;'>"
                + "Click here to reset your password</a></p>"
                + "<p>If you didn’t request this, please ignore this email.</p>"
                + "<br><p>Regards,<br><b>Zapkart Support Team</b></p>";

        mail.setMsgBody(htmlContent);
        emailService.sendHtmlMail(mail); // ✅ Use HTML method

        return "Reset link sent to your email";
    }

    @Override
    public String resetPassword(String token, String newPassword) {
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByResetToken(token));
        if (userOpt.isEmpty()) {
            return "Invalid token!";
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword)); // encrypt
        user.setResetToken(null); // clear token
        userRepository.save(user);

        return "Password updated successfully!";
    }

    @Override
    public User updateUserProfile(String email, String newName) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();
        user.setName(newName);
        return userRepository.save(user);
    }

    @Override
    public long displaycustomercount() {
        return userRepository.count();
    }

    @Override
    public long displaysellercount() {
        return userRepository.count();
    }

    @Override
    public long displayadmincount() {
        return userRepository.count();
    }

}
