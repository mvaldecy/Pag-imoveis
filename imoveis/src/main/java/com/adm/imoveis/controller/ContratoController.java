package com.adm.imoveis.controller;

import java.time.LocalDate;
import java.util.List;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.getAll());
  }

  @GetMapping(value = "contrato/{id}")
  public ResponseEntity<ContratoDto> findByContratoId(@PathVariable Long id) {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.findByContratoId(id));
  }

  @GetMapping(value = "contrato/imobiliaria/{id}")
  public ResponseEntity<List<ContratoDto>> findByImobiliariaId(@PathVariable Long imobiliariaId) {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.findByImobiliariaId(imobiliariaId));
  }

  @GetMapping(value = "contrato/inquilino/{id}")
  public ResponseEntity<List<ContratoDto>> findByInquilinoId(@PathVariable Long inquilinoId) {
    return ResponseEntity.status(HttpStatus.OK).body(contratoService.findByInquilinoId(inquilinoId));
  }

  @GetMapping(value = "contrato/ativos")
  public ResponseEntity<List<ContratoDto>> findByIsActive(@RequestParam boolean ativo) {
    return ResponseEntity.ok(contratoService.findByIsActive(ativo));
  }
  
  @GetMapping(value = "contrato/vencendo-em")
  public ResponseEntity<List<ContratoDto>> findExpiringWithin(@RequestParam int dias) {
    return ResponseEntity.ok(contratoService.findExpiringWithin(dias));
  }

  @GetMapping(value = "contrato/imovel/{id}")
  public ResponseEntity<List<ContratoDto>> findByImovelId(@PathVariable Long id) {
    return ResponseEntity.ok(contratoService.findByImovelId(id));
  }

  @DeleteMapping(value = "contrato/{id}")
  public ResponseEntity<String> deleteById(@PathVariable Long id) {
    contratoService.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  @PutMapping(value = "contrato/{id}/extend")
  public ResponseEntity<ContratoDto> extendContrato (@PathVariable Long id, @RequestParam LocalDate newDate) {
    return ResponseEntity.ok(contratoService.extend(id, newDate));
  }

  @PutMapping(value = "contrato/{id}/close")
  public ResponseEntity<String> closeContrato(@PathVariable Long id) {
    contratoService.close(id);
    return ResponseEntity.noContent().build();
  }
}
