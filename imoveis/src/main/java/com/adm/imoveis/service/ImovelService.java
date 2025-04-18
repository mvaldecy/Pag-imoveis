package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.imovel.ImovelCreationDto;
import com.adm.imoveis.dto.imovel.ImovelDto;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;
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
        Imovel newImovel = new Imovel(imovel.tipo(), imovel.tamanho(), imovel.apto(), imovel.status(), imovel.valor(), imovel.observacao());
        Predio predio = predioRepository.findById(imovel.predioId()).orElseThrow(PredioNotFound::new);
        newImovel.setPredio(predio);
        Imovel createdImovel = imovelRepository.save(newImovel);
        ImovelDto imovelResponse = DtoUtils.imovelModelToDto(createdImovel);
        return imovelResponse;
    }



    public List<ImovelDto> getAll() {
        List<Imovel> imovelList = imovelRepository.findAll();
        return DtoUtils.convertModelList(imovelList, DtoUtils::imovelModelToDto);
    }

    public List<ImovelDto> getByPredioId(Long predioId) { 
        Predio predio = predioRepository.findById(predioId).orElseThrow(PredioNotFound::new);
        List<Imovel> imovelList = imovelRepository.findByPredio(predio);
        return DtoUtils.convertModelList(imovelList, DtoUtils::imovelModelToDto);
    }

    public ImovelDto getById(Long id) {
        Imovel imovel = imovelRepository.findById(id).orElseThrow(ImovelNotFound::new);
        return DtoUtils.imovelModelToDto(imovel);
    }

    public ImovelDto update(Long id, ImovelCreationDto body) {
        Imovel imovel = imovelRepository.findById(id).orElseThrow(ImovelNotFound::new);
        imovel.setApto(body.apto());
        imovel.setStatus(body.status());
        imovel.setTamanho(body.tamanho());
        imovel.setTipo(body.tipo());
        imovel.setValor(body.valor());
        imovel.setObservacao(body.observacao());
        Imovel updatedImovel = imovelRepository.save(imovel);
        return DtoUtils.imovelModelToDto(updatedImovel);
    }

    public void deleteById(Long id) {
        imovelRepository.deleteById(id);
    }

    public List<ImovelDto> findByStatus(ImovelStatus status) {
        List<Imovel> imovelList = imovelRepository.findByStatus(status);
        return DtoUtils.convertModelList(imovelList, DtoUtils::imovelModelToDto);
    }

    public List<ImovelDto> findByTipo(ImovelTipo tipo) {
        List<Imovel> imovelList = imovelRepository.findByTipo(tipo);
        return DtoUtils.convertModelList(imovelList, DtoUtils::imovelModelToDto);
    }
}
