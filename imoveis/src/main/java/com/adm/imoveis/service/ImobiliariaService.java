package com.adm.imoveis.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.DtoUtils;
import com.adm.imoveis.dto.ImobiliariaCreationDto;
import com.adm.imoveis.dto.ImobiliariaDto;
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
  public ImobiliariaDto create(ImobiliariaCreationDto imobiliaria) {
    Imobiliaria newImobiliaria = new Imobiliaria(imobiliaria.nome());
    Imobiliaria createdImobiliaria = imobiliariaRepository.save(newImobiliaria);
    return new ImobiliariaDto(createdImobiliaria.getId(), createdImobiliaria.getNome(), createdImobiliaria.getInquilinos(), createdImobiliaria.getContratos());
  }

  public List<ImobiliariaDto> getAll() {
    List<Imobiliaria> imobiliariaList = imobiliariaRepository.findAll();
    return DtoUtils.imobiliariaModelListtoDtoList(imobiliariaList);
  }

  public ImobiliariaDto getById(Long id) {
    Imobiliaria imobiliaria = imobiliariaRepository.findById(id).orElseThrow(ImobiliariaNotFound::new);

    return DtoUtils.imobiliariaModelToDto(imobiliaria);
  }
}
