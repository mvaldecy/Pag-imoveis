package com.adm.imoveis.dto.predio;

import java.util.List;

import com.adm.imoveis.dto.imovel.ImovelResumoDto;


public record PredioDto(
    Long id,
    String nome,
    String endereco,
    List<ImovelResumoDto> imoveis) {
    
}
