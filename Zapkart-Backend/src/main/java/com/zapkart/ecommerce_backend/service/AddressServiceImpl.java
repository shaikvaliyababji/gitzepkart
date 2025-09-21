package com.zapkart.ecommerce_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zapkart.ecommerce_backend.model.Address;
import com.zapkart.ecommerce_backend.model.User;
import com.zapkart.ecommerce_backend.repository.AddressRepository;
import com.zapkart.ecommerce_backend.repository.UserRepository;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Address addAddress(Address address, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        address.setUser(user); // FIXED: setUser (was wrongly setBuyer before)
        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAddressesByUser(Long userId) {
        return addressRepository.findByUserId(userId); // FIXED: now using userId, not buyerId
    }

    @Override
    public void deleteAddress(int addressId) {
        if (addressRepository.existsById(addressId)) {
            addressRepository.deleteById(addressId);
        } else {
            throw new RuntimeException("Address not found with ID: " + addressId);
        }
    }
}
