package com.example.demo;

import com.example.demo.model.Administrador;
import com.example.demo.model.Rol;
import com.example.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            // Comprobamos que no exista ya para no duplicarlo si el servidor se reinicia
            if (!userRepository.existsByUsername("admin")) {
                Administrador admin = new Administrador();
                admin.setUsername("admin");

                admin.setPassword(passwordEncoder.encode("admin123"));

                admin.setRol(Rol.BACKOFFICE);

                userRepository.save(admin);
            }
        };
    }
}
