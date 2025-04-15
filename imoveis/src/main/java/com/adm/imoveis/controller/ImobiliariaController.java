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
import org.springframework.web.bind.annotation.RestController;

import com.adm.imoveis.dto.contrato.ContratoDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaCreationDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaDto;
import com.adm.imoveis.service.ImobiliariaService;

@RestController
@RequestMapping
public class ImobiliariaController {
    private final ImobiliariaService imobiliariaService;

    public ImobiliariaController(ImobiliariaService imobiliariaService) {
        this.imobiliariaService = imobiliariaService;
    }

    @PostMapping(value = "imobiliaria")
    public ResponseEntity<ImobiliariaDto> create(@RequestBody ImobiliariaCreationDto imobiliaria) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imobiliariaService.create(imobiliaria));
    }

    @GetMapping(value = "imobiliaria")
    public ResponseEntity<List<ImobiliariaDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(imobiliariaService.getAll());
    }

    @GetMapping(value = "imobiliaria/{id}")
    public ResponseEntity<ImobiliariaDto> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(imobiliariaService.getById(id));
    }

    @DeleteMapping(value = "imobiliaria")
    public ResponseEntity<String> deleteAll() {
        imobiliariaService.deleteAll();
        return ResponseEntity.status(HttpStatus.OK).body("Imobiliárias deletadas com sucesso");
    }

    @DeleteMapping(value = "imobiliaria/{id}")
    public ResponseEntity<String> deleteById(@PathVariable Long id) {
        imobiliariaService.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Imobiliária deletada com sucesso");
    }


    @PutMapping(value = "imobiliaria/{id}")
    public ResponseEntity<ImobiliariaDto> edit(@PathVariable Long id, @RequestBody ImobiliariaCreationDto imobiliaria) {
        return ResponseEntity.status(HttpStatus.OK).body(imobiliariaService.update(imobiliaria, id));
    }

    @GetMapping(value = "imobiliaria/{id}/contratos")
    public ResponseEntity<List<ContratoDto>> getContratosByImobiliariaId(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(imobiliariaService.getContratosByImobiliariaId(id));
    }


}
