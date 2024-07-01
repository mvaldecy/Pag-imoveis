package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Repasse;

public interface RepasseRepository extends JpaRepository<Repasse, Long> {
    
}
