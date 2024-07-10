package com.adm.imoveis.dto;

import java.time.YearMonth;
import java.time.LocalDate;
import com.adm.imoveis.entities.Contrato;

public record RepasseDto(
    Long id,
    LocalDate dataRepasse,
    Double valorRepasse,
    Contrato contrato
    ) {
    
}
