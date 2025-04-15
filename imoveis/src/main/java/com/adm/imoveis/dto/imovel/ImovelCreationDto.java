package com.adm.imoveis.dto.imovel;

public record ImovelCreationDto(String apto, String status, int tamanho, String tipo, Long predioId, Double valor) {
    
}
