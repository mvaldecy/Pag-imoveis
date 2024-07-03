package com.adm.imoveis.dto;

import java.time.LocalDate;

public record ContratoDto(Long id,LocalDate starDate, LocalDate endDate, String imobiliaria, String predioNome, String imovelApto, String inquilinoNome) {
    
}
