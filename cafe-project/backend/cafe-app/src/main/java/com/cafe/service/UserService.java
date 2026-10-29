package com.cafe.service;

import com.cafe.entity.Role;
import com.cafe.entity.User;
import com.cafe.repository.RoleRepository;
import com.cafe.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) { 
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder; 
    }

    public User register(String username, String password, String email) {
        Role userRole = roleRepository.findByName("USER");
        
        String encodedPassword = passwordEncoder.encode(password);
        
        User user = new User(username, encodedPassword, email); 
        user.getRoles().add(userRole);
        return userRepository.save(user);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
} 