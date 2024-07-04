package com.adm.imoveis.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.ImobiliariaDto;
import com.adm.imoveis.dto.InquilinoCreationDto;
import com.adm.imoveis.dto.InquilinoDto;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.InquilinoNotFound;

@Service
public class InquilinoService {
    private final InquilinoRepository inquilinoRepository;

    public InquilinoService(InquilinoRepository inquilinoRepository) {
        this.inquilinoRepository = inquilinoRepository;
    }

    private InquilinoDto convertModeltoDto(Inquilino inquilino) {
        return new InquilinoDto(
            inquilino.getId(),
            inquilino.getCpf(),
            inquilino.getNome(),
            inquilino.getStatus(),
            inquilino.getImobiliaria()
        );
    }

    private List<InquilinoDto> convertModelListtoDto(List<Inquilino> inquilinos) {
        return inquilinos.stream().map((i) -> convertModeltoDto(i)).collect(Collectors.toList());
    }

    public InquilinoDto create(InquilinoCreationDto inquilino) {
        Inquilino newInquilino = new Inquilino(inquilino.nome(), inquilino.cpf(), inquilino.status());
        
        Inquilino createdInquilino = inquilinoRepository.save(newInquilino);
        return convertModeltoDto(createdInquilino);
    }

    public List<InquilinoDto> getAll() {
        return convertModelListtoDto(inquilinoRepository.findAll());
    }

    public InquilinoDto getById(Long id) {
        Inquilino inquilino = inquilinoRepository.findById(id).orElseThrow(InquilinoNotFound::new);
        return convertModeltoDto(inquilino);
    }
}