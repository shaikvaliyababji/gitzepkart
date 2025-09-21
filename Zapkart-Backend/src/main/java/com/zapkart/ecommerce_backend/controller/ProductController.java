	package com.zapkart.ecommerce_backend.controller;
	
	
	import com.zapkart.ecommerce_backend.model.Product;
	import com.zapkart.ecommerce_backend.service.ProductService;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.web.bind.annotation.*;
	import java.util.List;

	@RestController
	@RequestMapping("/api/products")
	public class ProductController {
	
	    @Autowired
	    private ProductService productService;
	    
	    public static String uploadDirectory=System.getProperty("user.dir")+"/src/main/resources/static/images";
	    
	    
	    // Fetch all products - Accessible to all roles
	    @GetMapping
	    public ResponseEntity<List<Product>> getAllProducts() {
	        return new ResponseEntity<>(productService.getAllProducts(), HttpStatus.OK);
	    }
	    
	    @GetMapping("/computers")
	    public List<Product> getComputerProducts() {
	        return productService.getAllComputerProducts();
	    }
	    
	    @GetMapping("/fridge")
	    public List<Product> getFridgeProducts() {
	        return productService.getAllFridgeProducts();
	    }

	    @GetMapping("/mobile")
	    public List<Product> getMobileProducts() {
	        return productService.getAllMobileProducts();
	    }

	    @GetMapping("/watch")
	    public List<Product> getWatchProducts() {
	        return productService.getAllWatchProducts();
	    }
	    
	    @GetMapping("/menwear")
	    public List<Product> getMenProducts() {
	        return productService.getAllMenProducts();
	    }
	    
	    @GetMapping("/womanwear")
	    public List<Product> getWomanProducts() {
	        return productService.getAllWomanProducts();
	    }
	    
	    @GetMapping("/speaker")
	    public List<Product> getSpeakerProducts() {
	        return productService.getAllSpeakerProducts();
	    }
	    
	    @GetMapping("/tv")
	    public List<Product> getTvProducts() {
	        return productService.getAllTvProducts();
	    }
	    
	    @GetMapping("/furniture")
	    public List<Product> getFurnitureProducts() {
	        return productService.getAllFurnitureProducts();
	    }
	    
	    @GetMapping("/kitchen")
	    public List<Product> getKitchenProducts() {
	        return productService.getAllKitchenProducts();
	    }
	    
	    @GetMapping("/ac")
	    public List<Product> getAcProducts() {
	        return productService.getAllAcProducts();
	    }
	}
