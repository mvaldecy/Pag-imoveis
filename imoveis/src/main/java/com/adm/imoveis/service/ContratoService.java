package com.adm.imoveis.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.contrato.ContratoCreationDto;
import com.adm.imoveis.dto.contrato.ContratoDto;
import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.repositories.ContratoRepository;
import com.adm.imoveis.repositories.ImobiliariaRepository;
import com.adm.imoveis.repositories.ImovelRepository;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.service.exception.BusinessException;
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
        newContrato.setInquilino(inquilinoRepository.findById(contrato.inquilinoId()).orElseThrow(InquilinoNotFound::new));
        Contrato createdContrato = contratoRepository.save(newContrato);
        return DtoUtils.contratoModelToDto(createdContrato);
    }

    public List<ContratoDto> getAll() {
        List<Contrato> contratos = contratoRepository.findAll();
        return DtoUtils.convertModelList(contratos, DtoUtils::contratoModelToDto);
    }

    public ContratoDto findByContratoId (Long contratoId) {
        Contrato contrato = contratoRepository.findById(contratoId).orElseThrow(ContratoNotFound::new);
        return DtoUtils.contratoModelToDto(contrato);
    }


    public List<ContratoDto> findByImobiliariaId(Long imobiliariaId) {
        Imobiliaria imobiliaria = imobiliariaRepository.findById(imobiliariaId).orElseThrow(ImobiliariaNotFound::new);
        List<Contrato> contratos = contratoRepository.findByImobiliaria(imobiliaria);
        return DtoUtils.convertModelList(contratos, DtoUtils::contratoModelToDto);
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
        return DtoUtils.convertModelList(contratos, DtoUtils::contratoModelToDto);
    }

    public ContratoDto extend(Long id, LocalDate endDate) {
        Contrato contrato = contratoRepository.findById(id).orElseThrow(ContratoNotFound::new);
        contrato.setEndDate(endDate);
        Contrato newContrato = contratoRepository.save(contrato);
        return DtoUtils.contratoModelToDto(newContrato);
    }

    public void deleteById(Long id) {
        Contrato contrato = contratoRepository.findById(id).orElseThrow(ContratoNotFound::new);
        if (contrato.isActive()) {
            throw new BusinessException("Nao é permitido excluir um contrato ativo.");
        }
        contratoRepository.deleteById(id);
    }

    public List<ContratoDto> findByIsActive(boolean isActive) {
        List<Contrato> contratoList = contratoRepository.findByIsActive(isActive);
        return DtoUtils.convertModelList(contratoList, DtoUtils::contratoModelToDto);
    }

    public void close(Long id) {
        Contrato contrato = contratoRepository.findById(id).orElseThrow(ContratoNotFound::new);
        contrato.close();
        contratoRepository.save(contrato);
    }

    public List<ContratoDto> findExpiringWithin(int days) {
        LocalDate start = LocalDate.now();
        LocalDate end = start.plusDays(days);
        List<Contrato> contratoList = contratoRepository.findActiveContractsExpiringBetween(start, end);
        return DtoUtils.convertModelList(contratoList, DtoUtils::contratoModelToDto);
    }


    public List<ContratoDto> findByImovelId(Long imovelId) {
        Imovel imovel = imovelRepository.findById(imovelId).orElseThrow(ImovelNotFound::new);
        List<Contrato> contratoList = contratoRepository.findByImovel(imovel);
        return DtoUtils.convertModelList(contratoList, DtoUtils::contratoModelToDto);
    }
    
}
