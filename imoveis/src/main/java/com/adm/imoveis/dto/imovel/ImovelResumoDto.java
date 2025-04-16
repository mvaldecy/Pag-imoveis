package com.adm.imoveis.dto.imovel;

import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;

public record ImovelResumoDto(
    Long id,
    String apto,
    ImovelStatus status,
    int tamanho,
    ImovelTipo tipo,
    Long predioId,
    String predioNome,
    String predioEndereco,
    String observacao
) {}
