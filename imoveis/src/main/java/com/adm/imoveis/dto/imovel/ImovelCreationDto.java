package com.adm.imoveis.dto.imovel;

import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;

public record ImovelCreationDto(
    String apto,
    ImovelStatus status,
    int tamanho,
    ImovelTipo tipo,
    Long predioId,
    Double valor,
    String observacao
    ) {
    
}
