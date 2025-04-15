package com.adm.imoveis.dto.inquilino;

public record InquilinoCreationDto(
    String nome,
    String status,
    String cpf,
    Long imobiliariaId
) {}
