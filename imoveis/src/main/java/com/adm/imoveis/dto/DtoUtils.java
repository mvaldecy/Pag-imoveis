package com.adm.imoveis.dto;

import com.adm.imoveis.dto.contrato.ContratoResumoDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaDto;
import com.adm.imoveis.dto.imobiliaria.ImobiliariaResumoDto;
import com.adm.imoveis.dto.imovel.ImovelResumoDto;
import com.adm.imoveis.dto.inquilino.InquilinoResumoDto;
import com.adm.imoveis.dto.predio.PredioResumoDto;
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

    public static ImobiliariaResumoDto imobiliariModelToResumoDto(Imobiliaria imobiliaria) {
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
            imovel.getPredio().getId(),
            imovel.getPredio().getNome(),
            imovel.getPredio().getEndereco()
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

    // ------------------------------------ CONTRATO ------------------------------------------


    // =======================================================================================


    // ------------------------------------ REPASSE ------------------------------------------

    public static RepasseResumoDto RepasseModelToResumoDto(Repasse repasse) {
        return new RepasseResumoDto(
            repasse.getId(),
            repasse.getDataRepasse(),
            repasse.getValorRepasse()
        );
    }

    // ------------------------------------ REPASSE ------------------------------------------


    public static <T, R> List<R> convertModelList(List<T> modelList, Function<T, R> mapper) {
        return modelList.stream().map(mapper).toList();
    }
}
