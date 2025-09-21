package com.zapkart.ecommerce_backend.repository;

import com.zapkart.ecommerce_backend.model.Address;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
  
  List<Address> findByUserId(Long userId); // userId is Long
  Optional<Address> findByIdAndUserId(int addressId, Long userId);
}
