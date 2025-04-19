package com.adm.imoveis.controller;

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

import com.adm.imoveis.dto.repasse.RepasseCreationDto;
import com.adm.imoveis.dto.repasse.RepasseDto;
import com.adm.imoveis.service.RepasseService;

@RequestMapping
@RestController
public class RepasseController {
    private final RepasseService repasseService;

    public RepasseController(RepasseService repasseService) {
        this.repasseService = repasseService;
    }

    @PostMapping(value = "repasse")
    public ResponseEntity<RepasseDto> create(@RequestBody RepasseCreationDto repasse) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repasseService.create(repasse));
    }

    @GetMapping(value = "repasse")
    public ResponseEntity<List<RepasseDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(repasseService.findAll());
    }

    @GetMapping(value = "repasse/{id}")
    public ResponseEntity<RepasseDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(repasseService.findById(id));
    }

    @GetMapping(value = "repasse/contrato/{id}")
    public ResponseEntity<List<RepasseDto>> findByContratoId(@PathVariable Long contratoId) {
        return ResponseEntity.ok(repasseService.findByContratoId(contratoId));
    }

    @GetMapping(value = "repasse/mes")
    public ResponseEntity<List<RepasseDto>> findByMes(@RequestParam int mes, @RequestParam int ano) {
        return ResponseEntity.ok(repasseService.findByMes(ano, mes));
    }

    @PutMapping(value = "repasse/{id}")
    public ResponseEntity<RepasseDto> update(@PathVariable Long id, @RequestBody RepasseCreationDto repasse) {
        return ResponseEntity.ok(repasseService.update(id, repasse));
    }

    @DeleteMapping(value = "repasse/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        repasseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
