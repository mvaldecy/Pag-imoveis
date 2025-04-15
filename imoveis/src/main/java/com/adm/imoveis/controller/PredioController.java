package com.adm.imoveis.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adm.imoveis.dto.predio.PredioCreationDto;
import com.adm.imoveis.dto.predio.PredioDto;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.service.PredioService;

@RestController
@RequestMapping
public class PredioController {
    private final PredioService predioService;

    public PredioController(PredioService predioService) {
        this.predioService = predioService;
    }

    /**
     * Creates a new Predio based on the provided PredioCreationDto.
     *
     * @param  predio   the PredioCreationDto used to create the new Predio
     * @return          the created Predio as a ResponseEntity with HTTP status CREATED
     */
    @PostMapping(value = "predio")
    public ResponseEntity<PredioDto> create(@RequestBody PredioCreationDto predio) {
        return ResponseEntity.status(HttpStatus.CREATED).body(predioService.create(predio));
    }

    @GetMapping(value = "predio")
    public ResponseEntity<List<PredioDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(predioService.getALl());
    }
    
    @GetMapping(value = "predio/{id}")
    public ResponseEntity<PredioDto> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(predioService.getById(id));
    }
}
