package com.adm.imoveis.service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class InquilinoNotFound extends NotFoundException{
    public InquilinoNotFound() {
        super("Inquilino não encontrado");
    }
}