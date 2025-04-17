package com.adm.imoveis.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;



public interface ImovelRepository extends JpaRepository<Imovel, Long> {
    List<Imovel> findByPredio(Predio predio);
    List<Imovel> findByStatus(ImovelStatus status);
    List<Imovel> findByTipo(ImovelTipo tipo);    
}
