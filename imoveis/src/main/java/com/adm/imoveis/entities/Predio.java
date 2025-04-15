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
@Table(name = "predio")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Predio {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;
	private String endereco;
	
	@JsonIgnore
	@OneToMany(mappedBy = "predio")
	private List<Imovel> imoveis;


	public Predio() {}

	public Predio(String nome, String endereco) {
		this.nome = nome;
		this.endereco = endereco;
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
	public String getEndereco() {
		return endereco;
	}
	public void setEndereco(String endereco) {
		this.endereco = endereco;
	}
	
	public List<Imovel> getImoveis() {
		return imoveis;
	}
	public void setImoveis(List<Imovel> imoveis) {
		this.imoveis = imoveis;
	}

	

	
}
