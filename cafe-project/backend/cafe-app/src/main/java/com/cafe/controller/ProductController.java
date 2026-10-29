package com.cafe.controller;

import com.cafe.entity.Product;
import com.cafe.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @PostMapping
public ResponseEntity<Product> createProduct(@Valid @RequestBody Product product) {
    Product saved = productRepository.save(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
    
    @GetMapping("/{id}")
public ResponseEntity<Product> getProductById(@PathVariable Long id) {
    return productRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
    return productRepository.findById(id)
            .map(product -> {
                productRepository.delete(product);
                return ResponseEntity.ok().<Void>build();
            })
            .orElse(ResponseEntity.notFound().build());
}

@PutMapping("/{id}")
public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
    return productRepository.findById(id)
            .map(product -> {
                product.setName(updatedProduct.getName());
                product.setDescription(updatedProduct.getDescription());
                product.setPrice(updatedProduct.getPrice());
                product.setCategory(updatedProduct.getCategory());
                productRepository.save(product);
                return ResponseEntity.ok(product);
            })
            .orElse(ResponseEntity.notFound().build());
}


@GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productRepository.findByCategoryIgnoreCase(category);
        return ResponseEntity.ok(products);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name) {
        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(products);
    }
}