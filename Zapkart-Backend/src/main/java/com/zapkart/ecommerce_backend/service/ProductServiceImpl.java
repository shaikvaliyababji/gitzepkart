package com.zapkart.ecommerce_backend.service;

import com.zapkart.ecommerce_backend.model.Product;
import com.zapkart.ecommerce_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllComputerProducts() {
        return productRepository.findByName("computer");
    }

    @Override
    public List<Product> getAllFridgeProducts() {
        return productRepository.findByName("refrigerator");
    }

    @Override
    public List<Product> getAllMobileProducts() {
        return productRepository.findByName("mobile");
    }

    @Override
    public List<Product> getAllWatchProducts() {
        return productRepository.findByName("watch");
    }

    @Override
    public List<Product> getAllMenProducts() {
        return productRepository.findByName("menwear");
    }

    @Override
    public List<Product> getAllWomanProducts() {
        return productRepository.findByName("womanwear");
    }

    @Override
    public List<Product> getAllSpeakerProducts() {
        return productRepository.findByName("speaker");
    }

    @Override
    public List<Product> getAllTvProducts() {
        return productRepository.findByName("tv");
    }

    @Override
    public List<Product> getAllKitchenProducts() {
        return productRepository.findByName("kitchen");
    }

    @Override
    public List<Product> getAllFurnitureProducts() {
        return productRepository.findByName("furniture");
    }

    @Override
    public List<Product> getAllAcProducts() {
        return productRepository.findByName("ac");
    }

    public Product saveProductData(Product student) {
        return productRepository.save(student);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setCategory(updatedProduct.getCategory());
        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
