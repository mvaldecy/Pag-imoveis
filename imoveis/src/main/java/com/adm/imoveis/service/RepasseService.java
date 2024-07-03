package com.adm.imoveis.service;

import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.RepasseCreationDto;
import com.adm.imoveis.entities.Repasse;
import com.adm.imoveis.repositories.RepasseRepository;
import com.adm.imoveis.utils.DateUtil;

@Service
public class RepasseService {
    private final RepasseRepository repasseRepository;

    public RepasseService(RepasseRepository repasseRepository) {
        this.repasseRepository = repasseRepository;
    }

   

    


}
