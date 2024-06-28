package com.adm.imoveis.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.adm.imoveis.dto.ImobiliariaCreationDto;
import com.adm.imoveis.dto.ImobiliariaDto;
import com.adm.imoveis.service.ImobiliariaService;

@RestController
@RequestMapping
public class ImobiliariaController {
    private final ImobiliariaService imobiliariaService;

    public ImobiliariaController(ImobiliariaService imobiliariaService) {
        this.imobiliariaService = imobiliariaService;
    }

    @PostMapping
    public ResponseEntity<ImobiliariaDto> create(@RequestBody ImobiliariaCreationDto imobiliaria) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imobiliariaService.create(imobiliaria));
    }

    @GetMapping
    public ResponseEntity<List<ImobiliariaDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(imobiliariaService.getAll());
    }
}
