package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Contrato;

public interface ContratoRepository extends JpaRepository<Contrato, Long>{
    
}
