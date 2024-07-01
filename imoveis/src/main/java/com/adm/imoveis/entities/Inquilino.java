package com.adm.imoveis.entities;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inquilino")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Inquilino {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String nome;
	private String cpf;
	private String status; // criar interface


	@OneToOne
	@JoinColumn(name = "imovel_id")
	private Imovel imovel;

	@ManyToOne
	@JoinColumn(name = "imobiliaria_id")
	private Imobiliaria imobiliaria;

	@JsonIgnore
	@OneToMany(mappedBy = "inquilino")
	private List<Repasse> repasse;

	public Inquilino() {}

	public Inquilino(String nome, String cpf, String status) {
		this.nome = nome;
		this.cpf = cpf;
		this.status = status;
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

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Imobiliaria getImobiliaria() {
		return imobiliaria;
	}

	public void setImobiliaria(Imobiliaria imobiliaria) {
		this.imobiliaria = imobiliaria;
	}

	public Imovel getImovel() {
		return imovel;
	}

	public void setImovel(Imovel imovel) {
		this.imovel = imovel;
	}

	public List<Repasse> getRepasse() {
		return repasse;
	}

	public void setRepasse(List<Repasse> repasse) {
		this.repasse = repasse;
	}

	

	

}
