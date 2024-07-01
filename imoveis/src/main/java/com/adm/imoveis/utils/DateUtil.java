package com.adm.imoveis.utils;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

public abstract class DateUtil {
    public static YearMonth conversor(String date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM-yyyy");
        YearMonth dateResponse = YearMonth.parse(date, formatter);
        return dateResponse;
    }
}