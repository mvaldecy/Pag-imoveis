package com.adm.imoveis.dto;

import java.time.LocalDate;
import java.util.List;

import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.entities.Repasse;

public record ContratoDto(
    Long id,
    LocalDate starDate,
    LocalDate endDate,
    Imobiliaria imobiliaria,
    Imovel imovel,
    List<Repasse> repasse
    ) {
    
}
