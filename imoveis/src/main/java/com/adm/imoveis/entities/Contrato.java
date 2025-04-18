package com.adm.imoveis.entities;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "contrato")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Contrato {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean isActive;

    @ManyToOne
    @JoinColumn(name = "imovel_id")
    @JsonIgnore
    private Imovel imovel;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "inquilino_id")
    private Inquilino inquilino;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "imobiliaria_id")
    private Imobiliaria imobiliaria;

    @JsonIgnore
    @OneToMany(mappedBy = "contrato")
    private List<Repasse> repasses;


    public Contrato() {
        this.isActive = true;
    }

    public Contrato(LocalDate startDate, LocalDate endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Imovel getImovel() {
        return imovel;
    }

    public void setImovel(Imovel imovel) {
        this.imovel = imovel;
    }

    public Inquilino getInquilino() {
        return inquilino;
    }

    public void setInquilino(Inquilino inquilino) {
        this.inquilino = inquilino;
    }

    public Imobiliaria getImobiliaria() {
        return imobiliaria;
    }

    public void setImobiliaria(Imobiliaria imobiliaria) {
        this.imobiliaria = imobiliaria;
    }

    public List<Repasse> getRepasses() {
        return repasses;
    }

    public void setRepasses(List<Repasse> repasses) {
        this.repasses = repasses;
    }

    public boolean isActive() {
        return isActive;
    }

    public void close() {
        this.isActive = false;
    }
    
    

    
}
