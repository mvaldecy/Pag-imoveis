package com.adm.imoveis.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.imobiliaria.ImobiliariaDto;
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
        Imobiliaria imobiliaria = imobiliariaRepository.findById(inquilino.imobiliariaId()).orElseThrow(ImobiliariaNotFound::new);
        newInquilino.setImobiliaria(imobiliaria);
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

    public InquilinoDto finbyCpf(String cpf) {
        Inquilino inquilino = inquilinoRepository.findByCpf(cpf);
        if (inquilino == null) {
            throw new InquilinoNotFound();
        } else {
            return convertModeltoDto(inquilino);
        }
    }
}