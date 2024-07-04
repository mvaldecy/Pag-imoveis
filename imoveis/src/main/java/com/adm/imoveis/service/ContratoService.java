package com.adm.imoveis.service;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.ContratoCreationDto;
import com.adm.imoveis.dto.ContratoDto;
import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.repositories.ContratoRepository;
import com.adm.imoveis.repositories.ImobiliariaRepository;
import com.adm.imoveis.repositories.ImovelRepository;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.ImobiliariaNotFound;
import com.adm.imoveis.service.exception.ImovelNotFound;
import com.adm.imoveis.service.exception.InquilinoNotFound;

@Service
public class ContratoService {
    private final ContratoRepository contratoRepository;
    private final ImobiliariaRepository imobiliariaRepository;
    private final InquilinoRepository inquilinoRepository;
    private final ImovelRepository imovelRepository;

    public ContratoService (
        ContratoRepository contratoRepository,
        ImobiliariaRepository imobiliariaRepository,
        InquilinoRepository inquilinoRepository,
        ImovelRepository imovelRepository
        ) {
        this.contratoRepository = contratoRepository;
        this.imobiliariaRepository = imobiliariaRepository;
        this.imovelRepository = imovelRepository;
        this.inquilinoRepository = inquilinoRepository;
    }

    public ContratoDto convertModeltoDto(Contrato contrato) {
        return new ContratoDto(
            contrato.getId(),
            contrato.getStartDate(),
            contrato.getEndDate(),
            contrato.getImobiliaria(),
            contrato.getImovel(),
            contrato.getRepasses()
        );
    }

    public ContratoDto create(ContratoCreationDto contrato) {
        Contrato newContrato = new Contrato(contrato.startDate(), contrato.endDate());
        newContrato.setImobiliaria(imobiliariaRepository.findById(contrato.imobiliariaId()).orElseThrow(ImobiliariaNotFound::new));
        newContrato.setImovel(imovelRepository.findById(contrato.imovelId()).orElseThrow(ImovelNotFound::new));
        newContrato.setInquilino(inquilinoRepository.findById(contrato.inquilinoid()).orElseThrow(InquilinoNotFound::new));
        Contrato createdContrato = contratoRepository.save(newContrato);
        return convertModeltoDto(createdContrato);
    }



    
}
