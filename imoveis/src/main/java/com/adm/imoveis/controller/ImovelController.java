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

import com.adm.imoveis.dto.ImovelCreationDto;
import com.adm.imoveis.dto.ImovelDto;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.service.ImovelService;

@RequestMapping
@RestController
public class ImovelController {
    private final ImovelService imovelService;

    public ImovelController(ImovelService imovelService) {
        this.imovelService = imovelService;
    }

    @PostMapping(value = "imovel")
    public ResponseEntity<ImovelDto> create(@RequestBody ImovelCreationDto imovel) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imovelService.create(imovel));
    }

    @GetMapping(value = "imovel")
    public ResponseEntity<List<ImovelDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(imovelService.getAll());
    }

    @GetMapping(value = "imovel/{id}")
    public ResponseEntity<ImovelDto> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(imovelService.getById(id));
    }
}
