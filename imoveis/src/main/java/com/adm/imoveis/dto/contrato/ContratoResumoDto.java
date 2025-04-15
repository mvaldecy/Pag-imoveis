package com.adm.imoveis.dto.contrato;

import java.time.LocalDate;

public record ContratoResumoDto(
    Long contratoId,
    LocalDate startDate,
    LocalDate endDate,
    Long predioId,
    String predioNome,
    String predioEndereco,
    Long imovelId,
    String imovelApto,
    Long inquilinoId,
    String inquilinoNome,
    Long imobiliariaId,
    String imobiliariaNome
) {
    
}
