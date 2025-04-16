package com.adm.imoveis.entities.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ImovelTipo {
    APARTAMENTO_1_DORMITORIO("Apartamento - 1 dormitório"),
    APARTAMENTO_2_DORMITORIOS("Apartamento - 2 dormitórios"),
    APARTAMENTO_LUXO("Apartamento Luxo"),
    FLAT("Flat"),
    SALA_COMERCIAL("Sala comercial");

    private final String label;

    ImovelTipo(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return this.label;
    }

    @Override
    public String toString() {
        return label;
    }

}
