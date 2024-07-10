package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Inquilino;

import java.util.List;


public interface ContratoRepository extends JpaRepository<Contrato, Long>{   
    List<Contrato> findByImobiliaria(Imobiliaria imobiliaria);
    List<Contrato> findByInquilino(Inquilino inquilino);
    
}
