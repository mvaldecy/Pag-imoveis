package com.adm.imoveis.entities.Utils;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;  


// feito pelo gpt

@Converter(autoApply = false)
public class YearMonthConverter implements AttributeConverter<YearMonth, String> {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MM-yyyy");

    @Override
    public String convertToDatabaseColumn(YearMonth attribute) {
        return (attribute != null) ? attribute.format(FORMATTER) : null;
    }

    @Override
    public YearMonth convertToEntityAttribute(String dbData) {
        return (dbData != null) ? YearMonth.parse(dbData, FORMATTER) : null;
    }
}
