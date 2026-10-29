
package com.cafe.config;

import com.cafe.entity.Role;
import com.cafe.entity.User;
import com.cafe.repository.RoleRepository;
import com.cafe.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        
        return args -> {
            System.out.println("Инициализация данных...");
            
            Role userRole = createRoleIfNotFound(roleRepository, "ROLE_USER");
            Role adminRole = createRoleIfNotFound(roleRepository, "ROLE_ADMIN");
            
            if (userRepository.findByUsername("admin") == null) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123")); 
                admin.setEmail("admin@cafe.com");
                
                Set<Role> adminRoles = new HashSet<>();
                adminRoles.add(adminRole);
                adminRoles.add(userRole); 
                admin.setRoles(adminRoles);
                
                userRepository.save(admin);
                System.out.println("Администратор создан: admin / admin123");
            } else {
                System.out.println("ℹ Администратор уже существует");
            }
            
            System.out.println(" Инициализация завершена");
        };
        
    }
    
    private Role createRoleIfNotFound(RoleRepository roleRepository, String name) {
        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role(name);
            roleRepository.save(role);
            System.out.println("Создана роль: " + name);
        }
        return role;
    }
}