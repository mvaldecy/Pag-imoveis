package com.adm.imoveis.dto.repasse;

import java.time.YearMonth;

public record RepasseResumoDto(
    Long id,
    YearMonth dataRepasse,
    Double valorRepasse
) {}
