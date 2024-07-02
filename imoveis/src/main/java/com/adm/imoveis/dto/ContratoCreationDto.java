package com.adm.imoveis.dto;
import java.time.LocalDate;


public record ContratoCreationDto(Long inquilinoId, LocalDate startDate, LocalDate endDate) {
    
}
