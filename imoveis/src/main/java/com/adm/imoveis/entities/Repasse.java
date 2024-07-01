package com.adm.imoveis.entities;

import java.time.LocalDate;
import java.time.YearMonth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

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

    @ManyToOne
    @JoinColumn(name = "inquilino_id")
    private Inquilino inquilino;

    private Double valorRepasse;

    private YearMonth dataRepasse;

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

    public Inquilino getInquilino() {
        return inquilino;
    }

    public void setInquilino(Inquilino inquilino) {
        this.inquilino = inquilino;
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




}
