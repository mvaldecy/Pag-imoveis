package com.adm.imoveis.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adm.imoveis.dto.repasse.RepasseCreationDto;
import com.adm.imoveis.dto.repasse.RepasseDto;
import com.adm.imoveis.entities.Repasse;
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
}
