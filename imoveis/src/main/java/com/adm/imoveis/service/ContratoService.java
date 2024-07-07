package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.ContratoCreationDto;
import com.adm.imoveis.dto.ContratoDto;
import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.repositories.ContratoRepository;
import com.adm.imoveis.repositories.ImobiliariaRepository;
import com.adm.imoveis.repositories.ImovelRepository;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.ContratoNotFound;
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

    public List<ContratoDto> convertModelListToDto(List<Contrato> contratos) {
        return contratos.stream().map((i) -> convertModeltoDto(i)).toList();
    }

    /**
     * Creates a new ContratoDto object based on the provided ContratoCreationDto.
     *
     * @param  contrato   the ContratoCreationDto containing the data for the new Contrato
     * @return            the created ContratoDto object
     * @throws ImobiliariaNotFound if the imobiliaria with the given ID is not found
     * @throws ImovelNotFound if the imovel with the given ID is not found
     * @throws InquilinoNotFound if the inquilino with the given ID is not found
     */
    public ContratoDto create(ContratoCreationDto contrato) {
        Contrato newContrato = new Contrato(contrato.startDate(), contrato.endDate());
        newContrato.setImobiliaria(imobiliariaRepository.findById(contrato.imobiliariaId()).orElseThrow(ImobiliariaNotFound::new));
        newContrato.setImovel(imovelRepository.findById(contrato.imovelId()).orElseThrow(ImovelNotFound::new));
        newContrato.setInquilino(inquilinoRepository.findById(contrato.inquilinoid()).orElseThrow(InquilinoNotFound::new));
        Contrato createdContrato = contratoRepository.save(newContrato);
        return convertModeltoDto(createdContrato);
    }

    public List<ContratoDto> getall() {
        List<Contrato> contratos = contratoRepository.findAll();
        return convertModelListToDto(contratos);
    }

    public ContratoDto findByContratoId (Long contratoId) {
        Contrato contrato = contratoRepository.findById(contratoId).orElseThrow(ContratoNotFound::new);
        return convertModeltoDto(contrato);
    }

    public List<ContratoDto> findByImobiliariaId(Long imobiliariaId) {
        Imobiliaria imobiliaria = imobiliariaRepository.findById(imobiliariaId).orElseThrow(ImobiliariaNotFound::new);
        List<Contrato> contratos = contratoRepository.findByImobiliaria(imobiliaria);
        return convertModelListToDto(contratos);
    }

    /**
     * Finds all contratos associated with the given inquilinoId and returns them as a list of ContratoDto objects.
     *
     * @param  inquilinoId  the ID of the inquilino to search for
     * @return              a list of ContratoDto objects associated with the given inquilinoId
     * @throws InquilinoNotFound  if no inquilino with the given ID is found
     */
    public List<ContratoDto> findByInquilinoId(Long inquilinoId) {
        Inquilino inquilino = inquilinoRepository.findById(inquilinoId).orElseThrow(InquilinoNotFound::new);
        List<Contrato> contratos = contratoRepository.findByInquilino(inquilino);
        return convertModelListToDto(contratos);
    }



    
}
