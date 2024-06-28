package com.adm.imoveis.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ImobiliariaNotFound extends NotFoundException{
    public ImobiliariaNotFound() {
        super("Imobiliária não encontrada");
    }
}
