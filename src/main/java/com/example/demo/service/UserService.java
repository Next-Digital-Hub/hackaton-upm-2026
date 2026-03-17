package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.Rol;
import com.example.demo.dto.UserRegitrationDto;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public void registrarCiudadano(UserRegitrationDto dto){
        if (userRepository.exitsByUsername(dto.nombre())){
            throw new RuntimeException("Error: El nombre de usuario "+dto.nombre().trim()+" ya existe.");
        }

        User ciudadano= new User();

        ciudadano.setUsername(dto.nombre().trim());
        ciudadano.setProvincia(dto.provincia());
        ciudadano.setTipoVivienda(dto.tipoVivienda());
        ciudadano.setTipoNecesidades(dto.tipoNecesidades());
        ciudadano.setPassword(passwordEncoder.encode(dto.password()));
        ciudadano.setRol(Rol.CIUDADANO);

        userRepository.save(ciudadano);
    }

    public Optional<User> buscarPorNombre(String username) {
       return userRepository.findByUsername(username);
    }
}
