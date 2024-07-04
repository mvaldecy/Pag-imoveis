package com.adm.imoveis.dto;

import com.adm.imoveis.entities.Contrato;

public record RepasseDto(
    Long id,
    String dataRepasse,
    Double valorRepasse,
    Contrato contrato
    ) {
    
}
