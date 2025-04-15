package com.adm.imoveis.dto.predio;

public record PredioCreationDto(
    String nome,
    String endereco,
    String latitude,
    String longitude,
    String link
) {
    
}
