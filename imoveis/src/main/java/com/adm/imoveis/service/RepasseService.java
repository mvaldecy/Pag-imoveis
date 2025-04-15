package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.repasse.RepasseCreationDto;
import com.adm.imoveis.dto.repasse.RepasseDto;
import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Repasse;
import com.adm.imoveis.repositories.ContratoRepository;
import com.adm.imoveis.repositories.RepasseRepository;
import com.adm.imoveis.service.exception.ContratoNotFound;

@Service
public class RepasseService {
    private final RepasseRepository repasseRepository;
    private final ContratoRepository contratoRepository;  

    public RepasseService(RepasseRepository repasseRepository, ContratoRepository contratoRepository) {
        this.repasseRepository = repasseRepository;
        this.contratoRepository = contratoRepository;
    }


   public RepasseDto create(RepasseCreationDto repasse) {
        Repasse newRepasse = new Repasse(repasse.valorRepasse(), repasse.dataRepasse());
        Contrato contrato = contratoRepository.findById(repasse.contratoId()).orElseThrow(ContratoNotFound::new);
        newRepasse.setContrato(contrato);
        Repasse createdRepasse = repasseRepository.save(newRepasse);
        return DtoUtils.repasseModelToDto(createdRepasse);
   }

   public List<RepasseDto> findAll() {
    List<Repasse> repasseList = repasseRepository.findAll();
    return DtoUtils.convertModelList(repasseList, DtoUtils::repasseModelToDto);
   }

    


}
