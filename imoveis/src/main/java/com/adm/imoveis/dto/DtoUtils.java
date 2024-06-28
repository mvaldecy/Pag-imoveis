package com.adm.imoveis.dto;

import com.adm.imoveis.entities.Imobiliaria;
import java.util.List;

public class DtoUtils {
    public static ImobiliariaDto imobiliariaModelToDto(Imobiliaria imobiliaria) {
        return new ImobiliariaDto(imobiliaria.getId(), imobiliaria.getNome());
    }

    public static List<ImobiliariaDto> imobiliariaModelListtoDtoList(List<Imobiliaria> imobiliariaList) {
        return imobiliariaList.stream().map((i) -> new ImobiliariaDto(i.getId(), i.getNome())).toList();
    }
}
