package com.example.demo.dto;

import com.example.demo.model.Provincia;
import com.example.demo.model.Rol;
import com.example.demo.model.TipoNecesidades;
import com.example.demo.model.TipoVivienda;

public record UserRegitrationDto(
        String nombre,
        String password,
        Provincia provincia,
        TipoVivienda tipoVivienda,
        TipoNecesidades tipoNecesidades,
        Rol rol
) {

}
