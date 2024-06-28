package com.adm.imoveis.service;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.ImobiliariaCreationDto;
import com.adm.imoveis.dto.ImobiliariaDto;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.repositories.ImobiliariaRepository;

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
    return new ImobiliariaDto(createdImobiliaria.getId(), createdImobiliaria.getNome());
  }
}
