	package com.zapkart.ecommerce_backend.controller;
	
	
	import com.zapkart.ecommerce_backend.model.Product;
	import com.zapkart.ecommerce_backend.repository.ProductRepository;
	import com.zapkart.ecommerce_backend.service.ProductService;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.http.HttpStatus;
	import org.springframework.http.ResponseEntity;
	import org.springframework.security.access.prepost.PreAuthorize;
	import org.springframework.web.bind.annotation.*;
	
	import org.springframework.web.multipart.MultipartFile;
	
	import java.io.IOException;
	import java.nio.file.Files;
	import java.nio.file.Path;
	import java.nio.file.Paths;
	import java.util.List;
	
	@RestController
	@RequestMapping("/api/products")
	public class ProductController {
	
	    @Autowired
	    private ProductService productService;
	    
	    @Autowired
	    private ProductRepository productRepository;
	
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

	    
	    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
	    @PostMapping("/saveData")
		public Product saveProduct(@ModelAttribute Product product,@RequestParam("image")  MultipartFile file) throws IOException {
			String OriginalFileName =file.getOriginalFilename();
			Path fileNameandPath=Paths.get(uploadDirectory,OriginalFileName)	;
			Files.write(fileNameandPath, file.getBytes());
			product.setProfileImage(OriginalFileName);
			
			Product saveStudentData=productService.saveProductData(product);
			return saveStudentData;
		}
	
	    // Update product - Accessible to SELLER and ADMIN only
	    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
	    @PutMapping("/{id}")
	    public Product updateProduct(@PathVariable Long id,@RequestBody Product updatedProduct) {
	        Product existingProduct = productRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Product not found"));
	
	        if (updatedProduct.getName() != null) {
	            existingProduct.setName(updatedProduct.getName());
	        }
	        if (updatedProduct.getPrice() != null) {
	            existingProduct.setPrice(updatedProduct.getPrice());
	        }
	        if (updatedProduct.getStock() != null) {
	            existingProduct.setStock(updatedProduct.getStock());
	        }
	        if (updatedProduct.getDescription() != null) {
	            existingProduct.setDescription(updatedProduct.getDescription());
	        }
	        if (updatedProduct.getCategory() != null) {
	            existingProduct.setCategory(updatedProduct.getCategory());
	        }
	        if (updatedProduct.getSellerId() != null) {
	            existingProduct.setSellerId(updatedProduct.getSellerId());
	        }
	
	
	        return productRepository.save(existingProduct);
	    }
	
	
	
	    // Delete product - Accessible to SELLER and ADMIN only
	    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
	    @DeleteMapping("/{id}")
	    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
	        productService.deleteProduct(id);
	        return new ResponseEntity<>("Product deleted successfully", HttpStatus.OK);
	    }
	}
