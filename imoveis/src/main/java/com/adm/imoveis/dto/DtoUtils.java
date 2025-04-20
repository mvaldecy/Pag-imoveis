package com.adm.imoveis.dto;

import com.adm.imoveis.dto.contrato.ContratoDto;
import com.adm.imoveis.dto.contrato.ContratoResumoDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaResumoDto;
import com.adm.imoveis.dto.imovel.ImovelDto;
import com.adm.imoveis.dto.imovel.ImovelResumoDto;
import com.adm.imoveis.dto.inquilino.InquilinoDto;
import com.adm.imoveis.dto.inquilino.InquilinoResumoDto;
import com.adm.imoveis.dto.predio.PredioDto;
import com.adm.imoveis.dto.predio.PredioResumoDto;
import com.adm.imoveis.dto.repasse.RepasseDto;
import com.adm.imoveis.dto.repasse.RepasseResumoDto;
import com.adm.imoveis.entities.Contrato;
import com.adm.imoveis.entities.Imobiliaria;
import com.adm.imoveis.entities.Imovel;
import com.adm.imoveis.entities.Inquilino;
import com.adm.imoveis.entities.Predio;
import com.adm.imoveis.entities.Repasse;

import java.util.List;
import java.util.function.Function;


public class DtoUtils { // fazer primeiro a conversao pra resumoDto e depois pra Dto

    // ------------------------------------ IMOBILIARIA ------------------------------------------

    public static ImobiliariaResumoDto imobiliariaModelToResumoDto(Imobiliaria imobiliaria) {
        return new ImobiliariaResumoDto(
            imobiliaria.getId(),
            imobiliaria.getNome()
        );
    }

    public static ImobiliariaDto imobiliariaModelToDto(Imobiliaria imobiliaria) {
        return new ImobiliariaDto(
            imobiliaria.getId(),
            imobiliaria.getNome(),
            convertModelList(imobiliaria.getInquilinos(), DtoUtils::inquilinoModelToResumoDto),
            convertModelList(imobiliaria.getContratos(), DtoUtils::contratoModelToResumoDto)
        );
    }


    // ------------------------------------ IMOBILIARIA ------------------------------------------


    // ===========================================================================================

    
    // ------------------------------------ INQUILINO ------------------------------------------

    public static InquilinoResumoDto inquilinoModelToResumoDto(Inquilino inquilino) {
        return new InquilinoResumoDto(
            inquilino.getId(),
            inquilino.getNome(),
            inquilino.getCpf(),
            inquilino.getStatus()
        );
    }

    public static InquilinoDto inquilinoModelToDto(Inquilino inquilino) {
        return new InquilinoDto(
            inquilino.getId(),
            inquilino.getCpf(),
            inquilino.getNome(),
            inquilino.getStatus(),
            imobiliariaModelToResumoDto(inquilino.getImobiliaria()),
            convertModelList(inquilino.getContratos(), DtoUtils::contratoModelToResumoDto)
        );
    }

    // ------------------------------------ INQUILINO ------------------------------------------


    // ========================================================================================


    // ------------------------------------ PREDIO ------------------------------------------

    public static PredioResumoDto predioModelToResumoDto(Predio predio) {
        return new PredioResumoDto(
            predio.getId(),
            predio.getNome(),
            predio.getEndereco()
            );
    }

    public static PredioDto predioModelToDto(Predio predio) {
        return new PredioDto(
            predio.getId(),
            predio.getNome(),
            predio.getEndereco(),
            convertModelList(predio.getImoveis(), DtoUtils::imovelModelToResumoDto)
        );
    }


    // ------------------------------------ PREDIO ------------------------------------------


    // =======================================================================================


    // ------------------------------------ IMOVEL ------------------------------------------

    public static ImovelResumoDto imovelModelToResumoDto(Imovel imovel) {
        return new ImovelResumoDto(
            imovel.getId(),
            imovel.getApto(),
            imovel.getStatus(),
            imovel.getTamanho(),
            imovel.getTipo(),
            imovel.getValor(),
            imovel.getPredio().getId(),
            imovel.getPredio().getNome(),
            imovel.getPredio().getEndereco(),
            imovel.getObservacao()
        );
    }

    public static ImovelDto imovelModelToDto(Imovel imovel) {
        return new ImovelDto(
            imovel.getId(),
            imovel.getTipo(),
            imovel.getTamanho(),
            imovel.getApto(),
            imovel.getValor(),
            imovel.getStatus(),
            predioModelToResumoDto(imovel.getPredio()),
            imovel.getObservacao()
        );
    }


    // ------------------------------------ IMOVEL ------------------------------------------


    // ========================================================================================


    // ------------------------------------ CONTRATO ------------------------------------------

    public static ContratoResumoDto contratoModelToResumoDto(Contrato contrato) {
        return new ContratoResumoDto(
            contrato.getId(),
            contrato.getStartDate(),
            contrato.getEndDate(),
            contrato.isActive(),
            contrato.getImovel().getPredio().getId(),
            contrato.getImovel().getPredio().getNome(),
            contrato.getImovel().getPredio().getEndereco(),
            contrato.getImovel().getId(),
            contrato.getImovel().getApto(),
            contrato.getInquilino().getId(),
            contrato.getInquilino().getNome(),
            contrato.getImobiliaria().getId(),
            contrato.getImobiliaria().getNome()
        );
    }

    public static ContratoDto contratoModelToDto(Contrato contrato) {
        return new ContratoDto(
            contrato.getId(),
            contrato.getStartDate(),
            contrato.getEndDate(),
            contrato.isActive(),
            imobiliariaModelToResumoDto(contrato.getImobiliaria()),
            imovelModelToResumoDto(contrato.getImovel()),
            convertModelList(contrato.getRepasses(), DtoUtils::repasseModelToResumoDto)
        );
    }

    // ------------------------------------ CONTRATO ------------------------------------------


    // =======================================================================================


    // ------------------------------------ REPASSE ------------------------------------------

    public static RepasseResumoDto repasseModelToResumoDto(Repasse repasse) {
        return new RepasseResumoDto(
            repasse.getId(),
            repasse.getDataRepasse(),
            repasse.getValorRepasse()
        );
    }

    public static RepasseDto repasseModelToDto(Repasse repasse) {
        return new RepasseDto(
            repasse.getId(),
            repasse.getDataRepasse(),
            repasse.getValorRepasse(),
            contratoModelToResumoDto(repasse.getContrato())
        );
    }

    // ------------------------------------ REPASSE ------------------------------------------


    public static <T, R> List<R> convertModelList(List<T> modelList, Function<T, R> mapper) {
        if (modelList == null) return List.of(); // ⬅ retorna imediatamente se for null
        return modelList.stream().map(mapper).toList(); // ⬅ só executa se não for null
    }
    
}
