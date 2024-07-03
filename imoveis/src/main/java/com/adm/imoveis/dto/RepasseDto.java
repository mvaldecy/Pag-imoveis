package com.adm.imoveis.dto;

public record RepasseDto(
    Long id,
    String dataRepasse,
    Double valorRepasse,
    String predioNome,
    ContratoDto contratoDto) {
    
}
