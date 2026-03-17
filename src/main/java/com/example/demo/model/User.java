package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "rol-usuario")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String provincia; //Enum con provincias????

    @Column(nullable = false)
    private TipoVivienda tipoVivienda;

    @Column(nullable = false)
    private TipoNecesidades tipoNecesidades;

    @Column(nullable = false)
    private Rol rol;

    public long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public TipoVivienda getTipoVivienda() {
        return tipoVivienda;
    }

    public void setTipoVivienda(TipoVivienda tipoVivienda) {
        this.tipoVivienda = tipoVivienda;
    }

    public TipoNecesidades getTipoNecesidades() {
        return tipoNecesidades;
    }

    public void setTipoNecesidades(TipoNecesidades tipoNecesidades) {
        this.tipoNecesidades = tipoNecesidades;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
