package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.adm.imoveis.dto.InquilinoCreationDto;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.repositories.ImobiliariaRepository;
import com.adm.imoveis.repositories.ImovelRepository;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.ImobiliariaNotFound;
import com.adm.imoveis.service.exception.ImovelNotFound;
import com.adm.imoveis.service.exception.InquilinoNotFound;

@Service
public class InquilinoService {
    private final InquilinoRepository inquilinoRepository;
    private final ImobiliariaRepository imobiliariaRepository;
    private final ImovelRepository imovelRepository;

    public InquilinoService(
        InquilinoRepository inquilinoRepository,
        ImobiliariaRepository imobiliariarRepository,
        ImovelRepository imovelRepository) {
        this.inquilinoRepository = inquilinoRepository;
        this.imobiliariaRepository = imobiliariarRepository;
        this.imovelRepository = imovelRepository;
    }

    public Inquilino create(InquilinoCreationDto inquilino) {
        Inquilino newInquilino = new Inquilino(inquilino.nome(), inquilino.cpf(), inquilino.status());
        Imobiliaria imobiliaria = imobiliariaRepository.findById(inquilino.imobiliariaId()).orElseThrow(ImobiliariaNotFound::new);
        Imovel imovel = imovelRepository.findById(inquilino.imovelId()).orElseThrow(ImovelNotFound::new);
        newInquilino.setImovel(imovel);
        newInquilino.setImobiliaria(imobiliaria);
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