package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Inquilino;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface ContratoRepository extends JpaRepository<Contrato, Long>{   
    List<Contrato> findByImobiliaria(Imobiliaria imobiliaria);
    List<Contrato> findByInquilino(Inquilino inquilino);
    List<Contrato> findByIsActive(boolean isActive);
    List<Contrato> findByImovel(Imovel imovel);
    Optional<Contrato> findByIdAndIsActiveTrue(Long id);
    
    @Query("SELECT c FROM Contrato c WHERE c.isActive = true AND c.endDate BETWEEN :start AND :end")
    List<Contrato> findActiveContractsExpiringBetween(LocalDate start, LocalDate end);



}
