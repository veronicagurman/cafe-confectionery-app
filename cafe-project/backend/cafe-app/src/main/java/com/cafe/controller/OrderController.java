package com.cafe.controller;

import com.cafe.entity.Order;
import com.cafe.entity.User;
import com.cafe.service.OrderService;
import com.cafe.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(@RequestParam String username) {
        User user = userService.getByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        Order order = orderService.createOrder(user);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable String username) {
        User user = userService.getByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }
}
