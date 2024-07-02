package com.adm.imoveis.dto;

import java.util.List;

import com.adm.imoveis.entities.Imovel;

public record PredioDto(Long id, String nome, String endereco, String latitude, String longitude, String link, List<Imovel> imoveis) {
    
}
