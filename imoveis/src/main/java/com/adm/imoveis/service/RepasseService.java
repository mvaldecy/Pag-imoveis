package com.adm.imoveis.service;

import java.time.YearMonth;
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
import com.adm.imoveis.service.exception.RepasseNotFound;

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
    Contrato contrato = contratoRepository.findById(repasse.contratoId())
  		.orElseThrow(ContratoNotFound::new);
    newRepasse.setContrato(contrato);
    Repasse createdRepasse = repasseRepository.save(newRepasse);
    return DtoUtils.repasseModelToDto(createdRepasse);
  }

  public List<RepasseDto> findAll() {
    List<Repasse> repasseList = repasseRepository.findAll();
    return DtoUtils.convertModelList(repasseList, DtoUtils::repasseModelToDto);
  }
	public RepasseDto findById(Long repasseId) {
		Repasse repasse = repasseRepository.findById(repasseId)
        .orElseThrow(RepasseNotFound::new);
  	return DtoUtils.repasseModelToDto(repasse);
  }
	public RepasseDto update(Long repasseId, RepasseCreationDto body) {
	  Repasse repasse = repasseRepository.findById(repasseId)
    		.orElseThrow(RepasseNotFound::new);
    repasse.setDataRepasse(body.dataRepasse());
    repasse.setValorRepasse(body.valorRepasse());
    Repasse updated = repasseRepository.save(repasse);
    return DtoUtils.repasseModelToDto(updated);
  }

  public void deleteById(Long repasseId) {
  	repasseRepository.deleteById(repasseId);
  }

  public List<RepasseDto> findByContratoId(Long contratoId) {
    Contrato contrato = contratoRepository.findById(contratoId)
    	.orElseThrow(ContratoNotFound::new);
        
    List<Repasse> repasseList = repasseRepository.findByContrato(contrato);
    return DtoUtils.convertModelList(repasseList, DtoUtils::repasseModelToDto);
  }

	public List<RepasseDto> findByMes(int ano, int mes) {
		YearMonth ym = YearMonth.of(ano, mes);
		List<Repasse> repasseList = repasseRepository.findByDataRepasse(ym);
		return DtoUtils.convertModelList(repasseList, DtoUtils::repasseModelToDto);
	}

}
