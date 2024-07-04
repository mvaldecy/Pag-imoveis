package com.adm.imoveis.dto;

import com.adm.imoveis.entities.Predio;

public record ImovelDto(Long id, String tipo, int tamanho, String apto, String status, Predio predio) {
    
}
