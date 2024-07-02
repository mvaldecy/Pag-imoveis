package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.ImovelCreationDto;
import com.adm.imoveis.dto.ImovelDto;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.repositories.ImovelRepository;
import com.adm.imoveis.repositories.PredioRepository;
import com.adm.imoveis.service.exception.ImovelNotFound;
import com.adm.imoveis.service.exception.PredioNotFound;

@Service
public class ImovelService {
    private final ImovelRepository imovelRepository;
    private final PredioRepository predioRepository;

    public ImovelService(ImovelRepository imovelRepository, PredioRepository predioRepository) {
        this.imovelRepository = imovelRepository;
        this.predioRepository = predioRepository;
    }

    /**
     * Creates a new Imovel based on the provided ImovelCreationDto.
     *
     * @param  imovel   the ImovelCreationDto used to create the new Imovel
     * @return          the created Imovel
     */
    public Imovel create(ImovelCreationDto imovel) {
        Imovel newImovel = new Imovel(imovel.tipo(), imovel.tamanho(), imovel.apto(), imovel.status());
        Predio predio = predioRepository.findById(imovel.predioId()).orElseThrow(PredioNotFound::new);
        newImovel.setPredio(predio);
        Imovel createdImovel = imovelRepository.save(newImovel);
        return createdImovel;
    }

    public List<Imovel> getAll() {
        return imovelRepository.findAll();
    }

    public List<Imovel> getByPredioId(Long predioId) { // testar
        Predio predio = predioRepository.findById(predioId).orElseThrow(PredioNotFound::new);
        List<Imovel> imoveis = imovelRepository.findByPredio(predio);
        return imoveis;
    }

    public Imovel getById(Long id) {
        return imovelRepository.findById(id).orElseThrow(ImovelNotFound::new);
    }
}
