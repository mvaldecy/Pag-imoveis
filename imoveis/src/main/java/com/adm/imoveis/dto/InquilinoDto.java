package com.adm.imoveis.dto;

import com.adm.imoveis.entities.Imobiliaria;

public record InquilinoDto(Long id, String cpf, String nome, String status, ImobiliariaDto imobiliariaDto) {
    
}
