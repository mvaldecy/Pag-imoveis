package com.adm.imoveis.dto;

public record PredioCreationDto(
    String nome,
    String endereco,
    String latitude,
    String longitude,
    String link
) {
    
}
