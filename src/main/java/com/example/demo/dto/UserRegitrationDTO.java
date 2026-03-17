package com.example.demo.dto;

import com.example.demo.model.Provincia;
import com.example.demo.model.Rol;
import com.example.demo.model.TipoNecesidades;
import com.example.demo.model.TipoVivienda;

public record UserRegitrationDTO(
        String nombre,
        String password,
        Provincia provincia,
        TipoVivienda tipoVivienda,
        TipoNecesidades tipoNecesidades,
        Rol rol
) {

    @Override
    public String toString() {
        return """
                - **Nombre**: %s
                - **Provincia**: %s
                - **Tipo de Vivienda**: %s
                - **Necesidades Especiales**: %s
                - **Rol en el sistema**: %s
                """.formatted(
                nombre,
                provincia,
                tipoVivienda,
                tipoNecesidades,
                rol
        );
    }

}
