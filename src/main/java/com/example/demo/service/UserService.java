package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.model.Rol;
import com.example.demo.dto.UserRegitrationDto;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registrarCiudadano(UserRegitrationDto dto){
        User ciudadano= new User();

        ciudadano.setUsername(dto.nombre());
        ciudadano.setProvincia(dto.provincia());
        ciudadano.setTipoVivienda(dto.tipoVivienda());
        ciudadano.setTipoNecesidades(dto.tipoNecesidades());
        ciudadano.setPassword(passwordEncoder.encode(dto.password()));
        ciudadano.setRol(Rol.CIUDADANO);

        return userRepository.save(ciudadano);
    }
}
