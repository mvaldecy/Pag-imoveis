package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.InquilinoCreationDto;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.InquilinoNotFound;

@Service
public class InquilinoService {
    private final InquilinoRepository inquilinoRepository;

    public InquilinoService(InquilinoRepository inquilinoRepository) {
        this.inquilinoRepository = inquilinoRepository;
    }

    public Inquilino create(InquilinoCreationDto inquilino) {
        Inquilino newInquilino = new Inquilino(inquilino.nome(), inquilino.cpf(), inquilino.status());
        Inquilino createdInquilino = inquilinoRepository.save(newInquilino);
        return createdInquilino;
    }

    public List<Inquilino> getAll() {
        return inquilinoRepository.findAll();
    }

    public Inquilino getById(Long id) {
        Inquilino inquilino = inquilinoRepository.findById(id).orElseThrow(InquilinoNotFound::new);
        return inquilino;
    }
}