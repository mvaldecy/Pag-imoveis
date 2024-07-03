package com.adm.imoveis.dto;

public record ImovelDto(Long id, String tipo, int tamanho, String apto, String status, PredioDto predio) {
    
}
