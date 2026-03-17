package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping({"/", "/index"})
    public String mostrarIndex() {
        return "index"; // Busca index.html en la carpeta templates
    }

    @GetMapping("/dashboard")
    public String mostrarDashboard() {
        return "dashboard"; // Busca dashboard.html en la carpeta templates
    }

    @GetMapping("/admin")
    public String mostrarAdmin() {
        return "admin"; // Busca admin.html en la carpeta templates
    }
}
