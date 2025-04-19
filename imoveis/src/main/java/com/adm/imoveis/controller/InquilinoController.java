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

import com.adm.imoveis.dto.inquilino.InquilinoCreationDto;
import com.adm.imoveis.dto.inquilino.InquilinoDto;
import com.adm.imoveis.service.InquilinoService;

@RequestMapping
@RestController
public class InquilinoController {

    private final InquilinoService inquilinoService;

    public InquilinoController(InquilinoService inquilinoService) {
        this.inquilinoService = inquilinoService;
    }

    @PostMapping(value = "inquilino")
    public ResponseEntity<InquilinoDto> create(@RequestBody InquilinoCreationDto inquilino) {
        return ResponseEntity.status(HttpStatus.CREATED).body(inquilinoService.create(inquilino));
    }

    @GetMapping(value = "inquilino/{id}")
    public ResponseEntity<InquilinoDto> getById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(inquilinoService.getById(id));
    }

    @GetMapping(value = "inquilino")
    public ResponseEntity<List<InquilinoDto>> getAll() {
        return ResponseEntity.status(HttpStatus.OK).body(inquilinoService.getAll());
    }

    @GetMapping(value = "inquilino/cpf")
    public ResponseEntity<InquilinoDto> findByCpf(@RequestParam(value = "cpf") String cpf) {
        return ResponseEntity.ok(inquilinoService.findByCpf(cpf));
    }

    @PutMapping(value = "inquilino/{id}")
    public ResponseEntity<InquilinoDto> update(@PathVariable Long id, @RequestBody InquilinoCreationDto inquilino) {
        return ResponseEntity.ok(inquilinoService.update(id, inquilino));
    }

    @DeleteMapping(value = "inquilino/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        inquilinoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
