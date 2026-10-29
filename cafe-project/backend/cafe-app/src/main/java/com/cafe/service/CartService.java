package com.cafe.service;

import com.cafe.entity.CartItem;
import com.cafe.entity.Product;
import com.cafe.entity.User;
import com.cafe.repository.CartItemRepository;
import com.cafe.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }

    public List<CartItem> getUserCart(User user) {
        return cartItemRepository.findByUser(user);
    }

    public CartItem addToCart(User user, Long productId, int quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Товар не найден"));

        CartItem existingItem = cartItemRepository
                .findByUserAndProduct(user, product)
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            return cartItemRepository.save(existingItem);
        } else {
            CartItem newItem = new CartItem(user, product, quantity);
            return cartItemRepository.save(newItem);
        }
    }

    public void clearCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(items);
    }
}