package com.adm.imoveis.dto;
import java.time.LocalDate;


public record ContratoCreationDto(LocalDate startDate, LocalDate endDate, Long imobiliariaId, Long imovelId, Long inquilinoid) {
    
}
