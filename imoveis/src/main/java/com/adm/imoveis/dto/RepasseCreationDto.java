package com.adm.imoveis.dto;
import java.time.LocalDate;

public record RepasseCreationDto( Double valorRepasse, LocalDate dataRepasse, Long contratoId) {
    
}
