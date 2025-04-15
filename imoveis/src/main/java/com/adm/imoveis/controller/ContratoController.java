package com.adm.imoveis.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.adm.imoveis.dto.contrato.ContratoCreationDto;
import com.adm.imoveis.dto.contrato.ContratoDto;
import com.adm.imoveis.service.ContratoService;

@RestController
@RequestMapping
public class ContratoController {
  private final ContratoService contratoService;

  public ContratoController(ContratoService contratoService) {
    this.contratoService = contratoService;
  }

  @PostMapping(value = "contrato")
  public ResponseEntity<ContratoDto> create(@RequestBody ContratoCreationDto contrato) {
    return ResponseEntity.status(HttpStatus.CREATED).body(contratoService.create(contrato));
  }

  @GetMapping(value = "contrato")
  public ResponseEntity<List<ContratoDto>> getAll() {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.getall());
  }

  @GetMapping(value = "contrato/{id}")
  public ResponseEntity<ContratoDto> findByContratoId(@PathVariable Long contratoId) {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.findByContratoId(contratoId));
  }

  @GetMapping(value = "contrato/findByImobiliariaId/{id}")
  public ResponseEntity<List<ContratoDto>> findByImobiliariaId(@PathVariable Long imobiliariaId) {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.findByImobiliariaId(imobiliariaId));
  }

  @GetMapping(value = "contrato/findByInquilinoId/{id}")
  public ResponseEntity<List<ContratoDto>> findByInquilinoId(@PathVariable Long inquilinoId) {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.findByInquilinoId(inquilinoId));
  }
}
