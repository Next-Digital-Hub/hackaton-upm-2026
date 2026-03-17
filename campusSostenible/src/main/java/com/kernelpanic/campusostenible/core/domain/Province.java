package com.kernelpanic.campusostenible.core.domain;

import lombok.Getter;

@Getter
public enum Province {
    A_CORUNA(1L, "A Coruña"),
    ALAVA(2L, "Álava"),
    ALBACETE(3L, "Albacete"),
    ALICANTE(4L, "Alicante"),
    ALMERIA(5L, "Almería"),
    ASTURIAS(6L, "Asturias"),
    AVILA(7L, "Ávila"),
    BADAJOZ(8L, "Badajoz"),
    BARCELONA(9L, "Barcelona"),
    BURGOS(10L, "Burgos"),
    CACERES(11L, "Cáceres"),
    CADIZ(12L, "Cádiz"),
    CANTABRIA(13L, "Cantabria"),
    CASTELLON(14L, "Castellón"),
    CIUDAD_REAL(15L, "Ciudad Real"),
    CORDOBA(16L, "Córdoba"),
    CUENCA(17L, "Cuenca"),
    GIRONA(18L, "Girona"),
    GRANADA(19L, "Granada"),
    GUADALAJARA(20L, "Guadalajara"),
    GUIPUZCOA(21L, "Guipúzcoa"),
    HUELVA(22L, "Huelva"),
    HUESCA(23L, "Huesca"),
    ILLES_BALEARS(24L, "Illes Balears"),
    JAEN(25L, "Jaén"),
    LAS_PALMAS(26L, "Las Palmas"),
    LEON(27L, "León"),
    LLEIDA(28L, "Lleida"),
    LUGO(29L, "Lugo"),
    MADRID(30L, "Madrid"),
    MALAGA(31L, "Málaga"),
    MURCIA(32L, "Murcia"),
    NAVARRA(33L, "Navarra"),
    OURENSE(34L, "Ourense"),
    PALENCIA(35L, "Palencia"),
    PONTEVEDRA(36L, "Pontevedra"),
    LA_RIOJA(37L, "La Rioja"),
    SALAMANCA(38L, "Salamanca"),
    SANTA_CRUZ_DE_TENERIFE(39L, "Santa Cruz de Tenerife"),
    SEGOVIA(40L, "Segovia"),
    SEVILLA(41L, "Sevilla"),
    SORIA(42L, "Soria"),
    TARRAGONA(43L, "Tarragona"),
    TERUEL(44L, "Teruel"),
    TOLEDO(45L, "Toledo"),
    VALENCIA(46L, "Valencia"),
    VALLADOLID(47L, "Valladolid"),
    VIZCAYA(48L, "Vizcaya"),
    ZAMORA(49L, "Zamora"),
    ZARAGOZA(50L, "Zaragoza");

    private final Long id;
    private final String name;

    Province(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static Province fromId(Long id) {
        for (Province p : values()) {
            if (p.id.equals(id)) {
                return p;
            }
        }
        return null;
    }

    public static Province fromName(String name) {
        for (Province p : values()) {
            if (p.name.equalsIgnoreCase(name)) {
                return p;
            }
        }
        return null;
    }
}
