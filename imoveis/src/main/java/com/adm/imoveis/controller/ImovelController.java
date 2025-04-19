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

import com.adm.imoveis.dto.imovel.ImovelCreationDto;
import com.adm.imoveis.dto.imovel.ImovelDto;
import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;
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

    @GetMapping(value = "imovelByPredioId/{predioId}")
    public ResponseEntity<List<ImovelDto>> getByPredioId(@PathVariable Long predioId) {
        return ResponseEntity.status(HttpStatus.OK).body(imovelService.getByPredioId(predioId));
    }

    @PutMapping(value = "imovel/{id}")
    public ResponseEntity<ImovelDto> update(@PathVariable Long id, @RequestBody ImovelCreationDto imovel) {
        return ResponseEntity.status(HttpStatus.OK).body(imovelService.update(id, imovel));
    }

    @DeleteMapping(value = "imovel/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        imovelService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping(value = "imovel/por-status")
    public ResponseEntity<List<ImovelDto>> getByStatus(@RequestParam ImovelStatus status) {
        return ResponseEntity.status(HttpStatus.OK).body(imovelService.findByStatus(status));
    }

    @GetMapping(value = "imovel/por-tipo")
    public ResponseEntity<List<ImovelDto>> getByTipo(@RequestParam ImovelTipo tipo) {
        return ResponseEntity.status(HttpStatus.OK).body(imovelService.findByTipo(tipo));
    }

    @GetMapping(value = "imovel/status")
    public ResponseEntity<List<ImovelStatus>> getImovelStatus() {
        return ResponseEntity.ok(List.of(ImovelStatus.values()));
    }

    @GetMapping(value = "imovel/tipos")
    public ResponseEntity<List<ImovelTipo>> getImovelTipos() {
        return ResponseEntity.ok(List.of(ImovelTipo.values()));
    }


}
