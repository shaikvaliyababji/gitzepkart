package com.zapkart.ecommerce_backend.service;

import java.util.List;

import com.zapkart.ecommerce_backend.model.Address;



public interface AddressService {
  Address addAddress(Address address, Long userId);
  void deleteAddress(int addressId);
  List<Address> getAddressesByUser(Long userId);
}