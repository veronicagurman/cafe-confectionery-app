package com.cafe.controller;
import java.util.Map;

import com.cafe.entity.User;
import com.cafe.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
public ResponseEntity<User> register(@RequestBody Map<String, String> request) {
    String username = request.get("username");
    String password = request.get("password");
    String email = request.get("email");

    User user = userService.register(username, password, email);
    return ResponseEntity.status(HttpStatus.CREATED).body(user);
}


    @GetMapping("/profile/{username}")
    public ResponseEntity<User> getProfile(@PathVariable String username) {
        User user = userService.getByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
