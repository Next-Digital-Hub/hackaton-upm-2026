package com.example.demo.controller;

import com.example.demo.dto.UserRegitrationDto;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("registrar")
    public ResponseEntity<String> registrar(@RequestBody UserRegitrationDto dto){
        try {
            userService.registrarCiudadano(dto);
            return ResponseEntity.ok("Ciudadano regitrado");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Error en el registro: "+ e.getMessage());
        }
    }
}
