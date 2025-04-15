package com.adm.imoveis.dto.imovel;

import com.adm.imoveis.dto.predio.PredioResumoDto;


public record ImovelDto(
    Long id,
    String tipo,
    int tamanho,
    String apto,
    String status,
    PredioResumoDto predio
    ) {
    
}
