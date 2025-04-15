package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Inquilino;


import java.util.List;
import java.util.Optional;


public interface InquilinoRepository extends JpaRepository<Inquilino, Long> {
    List<Inquilino> findByImobiliaria(Imobiliaria imobiliaria);
    Optional<Inquilino> findByCpf(String cpf);
}
