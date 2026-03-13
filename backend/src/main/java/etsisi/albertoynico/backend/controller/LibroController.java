package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.model.Libro;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*")
public class LibroController {

    @GetMapping
    public List<Libro> getLibros() {
        return List.of(
                new Libro(1L, "Miguel de Cervantes", "Las aventuras de un hidalgo manchego que pierde la cordura por leer libros de caballerías", 1605),
                new Libro(2L, "Gabriel García Márquez", "La historia de siete generaciones de la familia Buendía en el pueblo ficticio de Macondo", 1967),
                new Libro(3L, "Federico García Lorca", "Tragedia rural sobre una novia que huye con su amante el día de su boda", 1933)
        );
    }
}
