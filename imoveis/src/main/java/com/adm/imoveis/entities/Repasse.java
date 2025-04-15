package com.adm.imoveis.entities;


import java.time.YearMonth;

import com.adm.imoveis.entities.Utils.YearMonthConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "repasse")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Repasse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double valorRepasse;

    @Convert(converter = YearMonthConverter.class)
    private YearMonth dataRepasse;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "contrato_id")
    private Contrato contrato;

    public Repasse() {}

    public Repasse(Double valorRepasse, YearMonth dataRepasse) {
        this.valorRepasse = valorRepasse;
        this.dataRepasse = dataRepasse;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getValorRepasse() {
        return valorRepasse;
    }

    public void setValorRepasse(Double valorRepasse) {
        this.valorRepasse = valorRepasse;
    }

    public YearMonth getDataRepasse() {
        return dataRepasse;
    }

    public void setDataRepasse(YearMonth dataRepasse) {
        this.dataRepasse = dataRepasse;
    }

    public Contrato getContrato() {
        return contrato;
    }

    public void setContrato(Contrato contrato) {
        this.contrato = contrato;
    }
}
