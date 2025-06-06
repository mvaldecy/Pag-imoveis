package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Repasse;
import java.util.List;
import java.time.YearMonth;



public interface RepasseRepository extends JpaRepository<Repasse, Long> {
    List<Repasse> findByContrato(Contrato contrato);
    List<Repasse> findByDataRepasse(YearMonth dataRepasse);
}
