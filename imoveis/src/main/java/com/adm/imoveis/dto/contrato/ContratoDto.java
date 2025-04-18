package com.adm.imoveis.dto.contrato;

import java.time.LocalDate;
import java.util.List;

import com.adm.imoveis.dto.imobiliaria.ImobiliariaResumoDto;
import com.adm.imoveis.dto.imovel.ImovelResumoDto;
import com.adm.imoveis.dto.repasse.RepasseResumoDto;

public record ContratoDto(
    Long id,
    LocalDate startDate,
    LocalDate endDate,
    boolean active,
    ImobiliariaResumoDto imobiliaria,
    ImovelResumoDto imovel,
    List<RepasseResumoDto> repasse
    ) {
    
}
