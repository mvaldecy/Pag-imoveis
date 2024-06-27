package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Predio;

public interface PredioRepository extends JpaRepository<Predio, Long> {
    
}
