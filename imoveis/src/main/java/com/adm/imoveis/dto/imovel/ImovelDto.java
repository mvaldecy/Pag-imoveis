package com.adm.imoveis.dto.imovel;

import com.adm.imoveis.dto.predio.PredioResumoDto;
import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;


public record ImovelDto(
    Long id,
    ImovelTipo tipo,
    int tamanho,
    String apto,
    ImovelStatus status,
    PredioResumoDto predio,
    String observacao
    ) {
    
}
