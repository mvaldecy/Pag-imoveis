package com.adm.imoveis.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Predio;

public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    List<Imovel> findByPredio(Predio predio);
}
