package com.adm.imoveis.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ImovelNotFound extends NotFoundException{
    public ImovelNotFound() {
        super("Imovel não encontrada");
    }
}
