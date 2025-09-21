package com.zapkart.ecommerce_backend.repository;

import com.zapkart.ecommerce_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email); //it will by defaultly converts into JPQL Query without writing external query
    
    @Query("select count(u) from User u where u.email=:email and u.password=:password")
    public long validateLogin(@Param("email") String email, @Param("password") String password);
    
    
    public User findByResetToken(String resetToken);
    
    
    
    
}