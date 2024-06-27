package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Imovel;

public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    
}
