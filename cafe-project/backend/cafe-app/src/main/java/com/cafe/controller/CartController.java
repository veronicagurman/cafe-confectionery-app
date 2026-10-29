package com.cafe.controller;

import com.cafe.entity.CartItem;
import com.cafe.entity.User;
import com.cafe.service.CartService;
import com.cafe.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    public CartController(CartService cartService, UserService userService) {
        this.cartService = cartService;
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable String username) {
        User user = userService.getByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(cartService.getUserCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(@RequestParam String username,
                                              @RequestParam Long productId,
                                              @RequestParam int quantity) {
        User user = userService.getByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        CartItem item = cartService.addToCart(user, productId, quantity);
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/clear/{username}")
    public ResponseEntity<Void> clearCart(@PathVariable String username) {
        User user = userService.getByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
}
