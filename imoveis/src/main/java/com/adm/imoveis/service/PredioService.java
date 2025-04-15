package com.adm.imoveis.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.predio.PredioCreationDto;
import com.adm.imoveis.dto.predio.PredioDto;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.repositories.ImovelRepository;
import com.adm.imoveis.repositories.PredioRepository;
import com.adm.imoveis.service.exception.PredioNotFound;

@Service
public class PredioService {
    private final PredioRepository predioRepository;
    private final ImovelRepository imovelRepository;

    public PredioService(PredioRepository predioRepository, ImovelRepository imovelRepository) {
        this.predioRepository = predioRepository;
        this.imovelRepository = imovelRepository;
    }


    public PredioDto create(PredioCreationDto predio) {
        Predio newPredio = new Predio(predio.nome(), predio.endereco());
        Predio createdPredio = predioRepository.save(newPredio);
        return DtoUtils.predioModelToDto(createdPredio);
    }
    
    public List<PredioDto> getALl() {
        List<Predio> predios = predioRepository.findAll();
        return DtoUtils.convertModelList(predios, DtoUtils::predioModelToDto);
    }

    public PredioDto getById(Long id) {
        Predio predio = predioRepository.findById(id).orElseThrow(PredioNotFound::new);
        return DtoUtils.predioModelToDto(predio);

    }
}
