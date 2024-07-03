package com.adm.imoveis.dto;

import java.time.LocalDate;

public record ContratoDto(
    Long id,
    LocalDate starDate,
    LocalDate endDate,
    Long imobiliariaId,
    String imobiliariaNome,
    Long predioId,
    String predioNome,
    String imovelId,
     
    InquilinoDto inquilinoDto) {
    
}
