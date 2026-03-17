package com.example.demo.controller;

import com.example.demo.dto.LoginDTO;
import com.example.demo.dto.CitizenDTO;
import com.example.demo.model.Rol;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Optional;

@Controller
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/registrar")
    public String registrar(CitizenDTO dto){
        try {
            userService.registrarCiudadano(dto);
            return "redirect:/dashboard";
        }catch (Exception e){
            return "redirect:/index?error=" + e.getMessage();
        }
    }

    @PostMapping("/login")
    public String login(LoginDTO dto){
        Optional<User> userOpt = userService.findByUsername(dto.username());
        if (userOpt.isPresent()){
            User user = userOpt.get();
            if (passwordEncoder.matches(dto.password(), user.getPassword())){
                if (user.getRol() == Rol.BACKOFFICE){
                    return "redirect:/admin";
                }else {
                    return "redirect:/dashboard";
                }
            }
        }

        return "redirect:/index?error=invalid_credentials";
    }

}