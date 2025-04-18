package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.contrato.ContratoDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaCreationDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaDto;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.repositories.ImobiliariaRepository;
import com.adm.imoveis.service.exception.ImobiliariaNotFound;

@Service
public class ImobiliariaService {
  private final ImobiliariaRepository imobiliariaRepository;

  public ImobiliariaService(ImobiliariaRepository imobiliariaRepository) {
    this.imobiliariaRepository = imobiliariaRepository;
  }

  /**
   * 
   * @param imobiliaria
   * @return
   */
  public ImobiliariaDto create(ImobiliariaCreationDto imobiliaria) { // #TODO - usar conversor de DTO
    Imobiliaria newImobiliaria = new Imobiliaria(imobiliaria.nome());
    Imobiliaria createdImobiliaria = imobiliariaRepository.save(newImobiliaria);
    return DtoUtils.imobiliariaModelToDto(createdImobiliaria);
  }

  public List<ImobiliariaDto> getAll() {
    List<Imobiliaria> imobiliariaList = imobiliariaRepository.findAll();
    return DtoUtils.convertModelList(imobiliariaList, DtoUtils::imobiliariaModelToDto);
  }

  public ImobiliariaDto getById(Long id) {
    Imobiliaria imobiliaria = imobiliariaRepository.findById(id).orElseThrow(ImobiliariaNotFound::new);

    return DtoUtils.imobiliariaModelToDto(imobiliaria);
  }

  public void deleteAll() {
    imobiliariaRepository.deleteAll();
  }

  public void deleteById(Long id) {
    imobiliariaRepository.deleteById(id);
  }

  public ImobiliariaDto update(ImobiliariaCreationDto body, Long id) {
    Imobiliaria imobiliaria = imobiliariaRepository.findById(id).orElseThrow(ImobiliariaNotFound::new);
    imobiliaria.setNome(body.nome());
    Imobiliaria updated = imobiliariaRepository.save(imobiliaria);
    return DtoUtils.imobiliariaModelToDto(updated);
  }

  public List<ContratoDto> getContratosByImobiliariaId(Long id) {
    Imobiliaria imobiliaria = imobiliariaRepository.findById(id).orElseThrow(ImobiliariaNotFound::new);
    return DtoUtils.convertModelList(imobiliaria.getContratos(), DtoUtils::contratoModelToDto);
  }


}
