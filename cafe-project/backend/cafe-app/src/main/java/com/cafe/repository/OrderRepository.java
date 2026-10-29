package com.cafe.repository;

import com.cafe.entity.Order;
import com.cafe.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    
    @Query("SELECT o FROM Order o WHERE LOWER(o.status) = LOWER(:status)")
    List<Order> findByStatus(@Param("status") String status);
}