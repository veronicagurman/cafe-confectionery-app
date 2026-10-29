package com.cafe.controller;

import com.cafe.entity.Order;
import com.cafe.entity.Product;
import com.cafe.repository.OrderRepository;
import com.cafe.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminController(ProductRepository productRepository,
                           OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    } 
    @PostMapping("/products")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        
        product.setCreatedAt(LocalDateTime.now());
        
        if (product.getAvailable() == null) {
            product.setAvailable(true);
        }
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                 @RequestBody Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setDescription(updatedProduct.getDescription());
                    product.setPrice(updatedProduct.getPrice());
                    product.setCategory(updatedProduct.getCategory());
                    
                    product.setComposition(updatedProduct.getComposition());
                    product.setWeight(updatedProduct.getWeight());
                    product.setCalories(updatedProduct.getCalories());
                    product.setExpirationDays(updatedProduct.getExpirationDays());
                    product.setStorageConditions(updatedProduct.getStorageConditions());
                    product.setAvailable(updatedProduct.getAvailable());
                    product.setImageUrl(updatedProduct.getImageUrl());
                    
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProductsAdmin() {
        return ResponseEntity.ok(productRepository.findAll());
    }
    
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }

    @PutMapping("/orders/{orderId}/confirm")
    public ResponseEntity<Order> confirmOrder(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("ПОДТВЕРЖДЕН");
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/orders/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(@PathVariable Long orderId) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus("ОТМЕНЕН");
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}