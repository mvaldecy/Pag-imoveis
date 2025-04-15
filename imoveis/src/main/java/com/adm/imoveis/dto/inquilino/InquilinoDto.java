package com.adm.imoveis.dto.inquilino;

import java.util.List;

import com.adm.imoveis.dto.contrato.ContratoResumoDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaResumoDto;

public record InquilinoDto(
    Long id,
    String cpf,
    String nome,
    String status,
    ImobiliariaResumoDto imobiliaria,
    List<ContratoResumoDto> contratos
    ) {
    
}
