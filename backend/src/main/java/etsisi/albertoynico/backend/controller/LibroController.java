package etsisi.albertoynico.backend.controller;

import etsisi.albertoynico.backend.manager.LibroManager;
import etsisi.albertoynico.backend.model.Libro;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/libros")
public class LibroController {

    private final LibroManager libroManager;

    public LibroController(LibroManager libroManager) {
        this.libroManager = libroManager;
    }

    @GetMapping
    public List<Libro> getLibros() {
        return libroManager.findAll();
    }

    @GetMapping("/{id}")
    public Libro getLibro(@PathVariable String id) {
        return libroManager.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado: " + id));
    }

    @PostMapping
    public Libro createLibro(@RequestBody Libro libro) {
        libro.setId(libroManager.newId());
        libroManager.save(libro);
        return libro;
    }

    @PutMapping("/{id}")
    public Libro updateLibro(@PathVariable String id, @RequestBody Libro libro) {
        libro.setId(id);
        libroManager.update(libro);
        return libro;
    }

    @DeleteMapping("/{id}")
    public void deleteLibro(@PathVariable String id) {
        libroManager.deleteById(id);
    }
}
