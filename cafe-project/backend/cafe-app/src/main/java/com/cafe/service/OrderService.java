package com.cafe.service;

import com.cafe.entity.CartItem;
import com.cafe.entity.Order;
import com.cafe.entity.User;
import com.cafe.repository.CartItemRepository;
import com.cafe.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }

    public Order createOrder(User user) {

        List<CartItem> cart = cartItemRepository.findByUser(user);

        double totalPrice = cart.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Order order = new Order(user, totalPrice);

        cartItemRepository.deleteAll(cart);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }
}
