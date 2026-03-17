package com.example.demo.service;

import com.example.demo.model.Ciudadano;
import com.example.demo.model.TipoNecesidades;
import com.example.demo.model.User;
import com.example.demo.model.Rol;
import com.example.demo.dto.CitizenDTO;
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

    public void registrarCiudadano(CitizenDTO dto){
        if (userRepository.existsByUsername(dto.username())){
            throw new RuntimeException("Error: El username de usuario "+dto.username().trim()+" ya existe.");
        }

        Ciudadano ciudadano= new Ciudadano();

        ciudadano.setUsername(dto.username().trim());
        ciudadano.setProvincia(dto.provincia());
        ciudadano.setTipoVivienda(dto.tipoVivienda());
        if (dto.tipoNecesidades()==null){
            ciudadano.setTipoNecesidades(TipoNecesidades.NINGUNA);
        }else{
            ciudadano.setTipoNecesidades(dto.tipoNecesidades());
        }
        ciudadano.setTipoNecesidades(dto.tipoNecesidades());
        ciudadano.setPassword(passwordEncoder.encode(dto.password()));
        ciudadano.setRol(Rol.CIUDADANO);

        userRepository.save(ciudadano);
    }

    public Optional<User> buscarPorNombre(String username) {
       return userRepository.findByUsername(username);
    }
}
