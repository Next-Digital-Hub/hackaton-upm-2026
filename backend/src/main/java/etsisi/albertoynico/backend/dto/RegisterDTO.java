package etsisi.albertoynico.backend.dto;

import etsisi.albertoynico.backend.model.RolUsuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterDTO {
    private String nombre;
    private String password;
    private UserFormDTO userForm;
}
