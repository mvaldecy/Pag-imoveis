package com.adm.imoveis.dto;

import java.time.YearMonth;

import com.adm.imoveis.entities.Contrato;

public record RepasseDto(
    Long id,
    YearMonth dataRepasse,
    Double valorRepasse,
    Contrato contrato
    ) {
    
}
