package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Imobiliaria;

public interface ImobiliariaRepository extends JpaRepository<Imobiliaria, Long> {
    
}
