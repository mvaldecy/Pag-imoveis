package com.adm.imoveis.dto;

import com.adm.imoveis.entities.Imobiliaria;
import java.util.List;
import java.util.stream.Collectors;

public class DtoUtils {
    public static ImobiliariaDto imobiliariaModelToDto(Imobiliaria imobiliaria) {
        return new ImobiliariaDto(imobiliaria.getId(), imobiliaria.getNome(), imobiliaria.getInquilinos(), imobiliaria.getContratos());
    }

    /**
     * Maps a list of Imobiliaria objects to a list of ImobiliariaDto objects.
     *
     * @param  imobiliariaList   the list of Imobiliaria objects to be mapped
     * @return                  a list of ImobiliariaDto objects
     */
    public static List<ImobiliariaDto> imobiliariaModelListtoDtoList(List<Imobiliaria> imobiliariaList) {
        return imobiliariaList.stream().map((i) -> new ImobiliariaDto(i.getId(), i.getNome(), i.getInquilinos(), i.getContratos())).collect(Collectors.toList());
    }
}
