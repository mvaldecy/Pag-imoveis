package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.predio.PredioCreationDto;
import com.adm.imoveis.dto.predio.PredioDto;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.repositories.PredioRepository;
import com.adm.imoveis.service.exception.PredioNotFound;

@Service
public class PredioService {
    private final PredioRepository predioRepository;


    public PredioService(PredioRepository predioRepository) {
        this.predioRepository = predioRepository;
    }


    public PredioDto create(PredioCreationDto predio) {
        Predio newPredio = new Predio(predio.nome(), predio.endereco());
        Predio createdPredio = predioRepository.save(newPredio);
        return DtoUtils.predioModelToDto(createdPredio);
    }
    
    public List<PredioDto> getAll() {
        List<Predio> predios = predioRepository.findAll();
        return DtoUtils.convertModelList(predios, DtoUtils::predioModelToDto);
    }

    public PredioDto getById(Long id) {
        Predio predio = predioRepository.findById(id).orElseThrow(PredioNotFound::new);
        return DtoUtils.predioModelToDto(predio);

    }

    public void deleteById(Long id) {
        predioRepository.deleteById(id);
    }

    public PredioDto update(Long predioId, PredioCreationDto body) {
        Predio predio = predioRepository.findById(predioId).orElseThrow(PredioNotFound::new);
        predio.setNome(body.nome());
        predio.setEndereco(body.endereco());
        Predio updated = predioRepository.save(predio);
        return DtoUtils.predioModelToDto(updated);
    }
}
