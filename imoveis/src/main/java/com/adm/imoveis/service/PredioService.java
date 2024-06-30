package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.PredioCreationDto;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.repositories.PredioRepository;
import com.adm.imoveis.service.exception.PredioNotFound;

@Service
public class PredioService {
    private final PredioRepository predioRepository;

    public PredioService(PredioRepository predioRepository) {
        this.predioRepository = predioRepository;
    }

    public Predio create(PredioCreationDto predio) {
        Predio newPredio = new Predio(predio.nome(), predio.endereco(), predio.latitude(), predio.longitude(), predio.link());
        Predio createdPredio = predioRepository.save(newPredio);
        return createdPredio;
    }

    public List<Predio> getALl() {
        return predioRepository.findAll();
    }

    public Predio getById(Long id) {
        return predioRepository.findById(id).orElseThrow(PredioNotFound::new);
    }
}
