package etsisi.albertoynico.backend.dto;

import etsisi.albertoynico.backend.model.NecesidadEspecial;
import etsisi.albertoynico.backend.model.Provincia;
import etsisi.albertoynico.backend.model.TipoVivienda;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserFormDTO {
    private Provincia provincia;
    private TipoVivienda tipoVivienda;
    private Set<NecesidadEspecial> necesidadesEspeciales;
}
