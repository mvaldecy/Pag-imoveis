package com.adm.imoveis.dto;

public record InquilinoCreationDto(
    String nome,
    String status,
    String cpf,
    Long imobiliariaId,
    Long imovelId
) {}
