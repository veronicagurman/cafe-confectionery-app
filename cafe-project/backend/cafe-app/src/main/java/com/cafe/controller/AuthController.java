package com.cafe.controller;

import com.cafe.config.JwtUtil;
import com.cafe.entity.User;
import com.cafe.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                         JwtUtil jwtUtil,
                         UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
            String token = jwtUtil.generateToken(username);
            
            User user = userService.getByUsername(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("roles", user.getRoles().stream()
                .map(role -> role.getName())
                .toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Неверный логин или пароль");
            return ResponseEntity.status(401).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            String email = request.get("email");
            
            if (userService.getByUsername(username) != null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Пользователь уже существует");
                return ResponseEntity.badRequest().body(error);
            }
            
            User user = userService.register(username, password, email);
            
            String token = jwtUtil.generateToken(username);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("message", "Регистрация успешна");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Ошибка регистрации: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}