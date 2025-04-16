package com.adm.imoveis.entities.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ImovelStatus {
    DISPONIVEL("Disponível"),
    OCUPADO("Ocupado");

    private final String label;

    ImovelStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel()  {
        return this.label;
    }

    @Override
    public String toString() {
        return label;
    }
}
