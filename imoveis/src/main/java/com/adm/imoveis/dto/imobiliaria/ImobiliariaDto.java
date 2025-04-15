package com.adm.imoveis.dto.imobiliaria;

import com.adm.imoveis.dto.contrato.ContratoResumoDto;
import com.adm.imoveis.dto.inquilino.InquilinoResumoDto;
import java.util.List;

public record ImobiliariaDto(
    Long id,
    String nome,
    List<InquilinoResumoDto> inquilinos,
    List<ContratoResumoDto> contratos
    ) {
    
}
