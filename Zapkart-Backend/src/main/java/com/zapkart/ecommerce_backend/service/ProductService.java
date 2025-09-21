package com.zapkart.ecommerce_backend.service;

import com.zapkart.ecommerce_backend.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();

    List<Product> getAllComputerProducts();

    List<Product> getAllFridgeProducts();

    List<Product> getAllMobileProducts();

    List<Product> getAllWatchProducts();

    List<Product> getAllMenProducts();

    List<Product> getAllWomanProducts();

    List<Product> getAllSpeakerProducts();

    List<Product> getAllTvProducts();

    List<Product> getAllKitchenProducts();

    List<Product> getAllFurnitureProducts();

    List<Product> getAllAcProducts();

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    Product saveProductData(Product product);
}
