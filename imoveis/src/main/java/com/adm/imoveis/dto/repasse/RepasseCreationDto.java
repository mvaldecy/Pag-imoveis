package com.adm.imoveis.dto.repasse;

import java.time.YearMonth;

public record RepasseCreationDto(
    Double valorRepasse,
    YearMonth dataRepasse,
    Long contratoId) {
    
}
