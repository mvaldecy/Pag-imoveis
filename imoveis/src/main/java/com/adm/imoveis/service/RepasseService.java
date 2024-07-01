package com.adm.imoveis.service;

import java.time.YearMonth;
import java.util.List;

import org.springframework.stereotype.Service;

import com.adm.imoveis.dto.RepasseCreaationDto;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.entities.Repasse;
import com.adm.imoveis.repositories.InquilinoRepository;
import com.adm.imoveis.repositories.RepasseRepository;
import com.adm.imoveis.service.exception.InquilinoNotFound;
import com.adm.imoveis.utils.DateUtil;

@Service
public class RepasseService {
    private final RepasseRepository repasseRepository;
    private final InquilinoRepository inquilinoRepository;


    public RepasseService(RepasseRepository repasseRepository, InquilinoRepository inquilinoRepository) {
        this.repasseRepository = repasseRepository;
        this.inquilinoRepository = inquilinoRepository;
    }

    public Repasse create(RepasseCreaationDto repasse) {
        Inquilino inquilino = inquilinoRepository.findById(repasse.inquilinoId()).orElseThrow(InquilinoNotFound::new);
        YearMonth convertedDate = DateUtil.conversor(repasse.dataRepasse());
        Repasse newRepasse = new Repasse(repasse.vaalorRepasse(), convertedDate);
        newRepasse.setInquilino(inquilino);
        return repasseRepository.save(newRepasse);
    }

    public List<Repasse> getAll() {
        return repasseRepository.findAll();
    }

    


}
