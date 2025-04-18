package com.adm.imoveis.service;

import java.util.List;


import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.inquilino.InquilinoCreationDto;
import com.adm.imoveis.dto.inquilino.InquilinoDto;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.repositories.ImobiliariaRepository;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.ImobiliariaNotFound;
import com.adm.imoveis.service.exception.InquilinoNotFound;

@Service
public class InquilinoService {
    private final InquilinoRepository inquilinoRepository;
    private final ImobiliariaRepository imobiliariaRepository;

    public InquilinoService(InquilinoRepository inquilinoRepository, ImobiliariaRepository imobiliariaRepository) {
        this.inquilinoRepository = inquilinoRepository;
        this.imobiliariaRepository = imobiliariaRepository;
    }



    public InquilinoDto create(InquilinoCreationDto inquilino) {
        Inquilino newInquilino = new Inquilino(inquilino.nome(), inquilino.cpf(), inquilino.status());
        Imobiliaria imobiliaria = imobiliariaRepository.findById(inquilino.imobiliariaId()).orElseThrow(ImobiliariaNotFound::new);
        newInquilino.setImobiliaria(imobiliaria);
        Inquilino createdInquilino = inquilinoRepository.save(newInquilino);
        return DtoUtils.inquilinoModelToDto(createdInquilino);
    }

    public List<InquilinoDto> getAll() {
        List<Inquilino> inquilinoList = inquilinoRepository.findAll();
        return DtoUtils.convertModelList(inquilinoList, DtoUtils::inquilinoModelToDto);
    }

    public InquilinoDto getById(Long id) {
        Inquilino inquilino = inquilinoRepository.findById(id).orElseThrow(InquilinoNotFound::new);
        return DtoUtils.inquilinoModelToDto(inquilino);
    }

    public InquilinoDto findByCpf(String cpf) {
        Inquilino inquilino = inquilinoRepository.findByCpf(cpf).orElseThrow(InquilinoNotFound::new);
        return DtoUtils.inquilinoModelToDto(inquilino);
    }

    public InquilinoDto update(Long id, InquilinoCreationDto body) {
        Inquilino inquilino = inquilinoRepository.findById(id).orElseThrow(InquilinoNotFound::new);
        inquilino.setNome(body.nome());
        inquilino.setStatus(body.status());
        inquilino.setCpf(body.cpf());
        Inquilino updated = inquilinoRepository.save(inquilino);
        return DtoUtils.inquilinoModelToDto(updated); 
    }

    public void deleteById(Long id) {
        inquilinoRepository.deleteById(id);
    }
}