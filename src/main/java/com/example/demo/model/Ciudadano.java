package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("CIUDADANO")
public class Ciudadano extends User{
    @Column
    private Provincia provincia;

    @Column
    private TipoVivienda tipoVivienda;

    @Column
    private TipoNecesidades tipoNecesidades;

    public Provincia getProvincia() {
        return provincia;
    }

    public void setProvincia(Provincia provincia) {
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
}
