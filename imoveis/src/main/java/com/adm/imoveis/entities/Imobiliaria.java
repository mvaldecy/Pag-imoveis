package com.adm.imoveis.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "imobiliaria")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Imobiliaria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;

    @JsonIgnore
    @OneToMany(mappedBy = "imobiliaria")
    private List<Inquilino> inquilinos;

    @JsonIgnore
    @OneToMany(mappedBy = "imobiliaria")
    private List<Contrato> contratos;


    public Imobiliaria() {}
    

    public Imobiliaria(String nome) {
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    

    @Override
    public String toString() {
        return "Imobiliaria [id=" + id + ", nome=" + nome + "]";
    }

    public List<Inquilino> getInquilinos() {
        return inquilinos;
    }


    public void setInquilinos(List<Inquilino> inquilinos) {
        this.inquilinos = inquilinos;
    }


    public List<Contrato> getContratos() {
        return contratos;
    }


    public void setContratos(List<Contrato> contratos) {
        this.contratos = contratos;
    }

    
    
    
    
}
