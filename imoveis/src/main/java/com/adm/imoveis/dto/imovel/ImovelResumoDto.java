package com.adm.imoveis.dto.imovel;

public record ImovelResumoDto(
    Long id,
    String apto,
    String status,
    int tamanho,
    String tipo,
    Long predioId,
    String predioNome,
    String predioEndereco
) {}
