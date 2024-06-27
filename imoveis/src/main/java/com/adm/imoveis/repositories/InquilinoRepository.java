package com.adm.imoveis.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.adm.imoveis.entities.Inquilino;

public interface InquilinoRepository extends JpaRepository<Inquilino, Long> {}
