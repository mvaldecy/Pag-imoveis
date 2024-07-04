package com.adm.imoveis.dto;

import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Inquilino;
import java.util.List;

public record ImobiliariaDto(
    Long id,
    String nome,
    List<Inquilino> inquilinos,
    List<Contrato> contratos
    ) {
    
}
