package com.adm.imoveis.dto.repasse;

import java.time.YearMonth;
import com.adm.imoveis.dto.contrato.ContratoResumoDto;


public record RepasseDto(
    Long id,
    YearMonth dataRepasse,
    Double valorRepasse,
    ContratoResumoDto contrato
    ) {
    
}
