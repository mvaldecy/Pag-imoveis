package com.adm.imoveis.service;

import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.RepasseCreationDto;
import com.adm.imoveis.dto.RepasseDto;
import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Repasse;
import com.adm.imoveis.repositories.ContratoRepository;
import com.adm.imoveis.repositories.RepasseRepository;
import com.adm.imoveis.service.exception.ContratoNotFound;
import com.adm.imoveis.utils.DateUtil;

@Service
public class RepasseService {
    private final RepasseRepository repasseRepository;
    private final ContratoRepository contratoRepository;

    public RepasseService(RepasseRepository repasseRepository, ContratoRepository contratoRepository) {
        this.repasseRepository = repasseRepository;
        this.contratoRepository = contratoRepository;
    }

    public RepasseDto convertModelToDto(Repasse repasse) {
        return new RepasseDto(
            repasse.getId(),
            repasse.getDataRepasse(),
            repasse.getValorRepasse(),
            repasse.getContrato()
        );
    }

    public List<RepasseDto> convertModelListToDto(List<Repasse> repasses) {
        return repasses.stream().map((i) -> convertModelToDto(i)).toList();
    }

   public RepasseDto create(RepasseCreationDto repasse) {
        Repasse newRepasse = new Repasse(repasse.valorRepasse(), repasse.dataRepasse());
        Contrato contrato = contratoRepository.findById(repasse.contratoId()).orElseThrow(ContratoNotFound::new);
        newRepasse.setContrato(contrato);
        Repasse createdRepasse = repasseRepository.save(newRepasse);
        return convertModelToDto(createdRepasse);
   }

   public List<RepasseDto> findAll() {
    return convertModelListToDto(repasseRepository.findAll());
   }

    


}
