package com.adm.imoveis.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.imovel.ImovelCreationDto;
import com.adm.imoveis.dto.imovel.ImovelDto;
import com.adm.imoveis.dto.predio.PredioDto;
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
    public ImovelDto create(ImovelCreationDto imovel) {
        Imovel newImovel = new Imovel(imovel.tipo(), imovel.tamanho(), imovel.apto(), imovel.status());
        Predio predio = predioRepository.findById(imovel.predioId()).orElseThrow(PredioNotFound::new);
        newImovel.setPredio(predio);
        Imovel createdImovel = imovelRepository.save(newImovel);
        ImovelDto imovelResponse = convertImovelModeltoDto(createdImovel);
        return imovelResponse;
    }

    public static ImovelDto convertImovelModeltoDto(Imovel imovel) {
        return new ImovelDto(
            imovel.getId(),
            imovel.getTipo(),
            imovel.getTamanho(),
            imovel.getApto(),
            imovel.getStatus(),
            imovel.getPredio()
        );
    }

    public static List<ImovelDto> convertImovelModelListtoDto(List<Imovel> imoveis) {
        List<ImovelDto> response = imoveis.stream().map((i) -> convertImovelModeltoDto(i)).collect(Collectors.toList());
        return response;
    }

    public List<ImovelDto> getAll() {
        return convertImovelModelListtoDto(imovelRepository.findAll());
    }

    public List<ImovelDto> getByPredioId(Long predioId) { 
        Predio predio = predioRepository.findById(predioId).orElseThrow(PredioNotFound::new);
        List<Imovel> imoveis = imovelRepository.findByPredio(predio);
        return convertImovelModelListtoDto(imoveis);
    }

    public ImovelDto getById(Long id) {
        return convertImovelModeltoDto(imovelRepository.findById(id).orElseThrow(ImovelNotFound::new));
    }
}
