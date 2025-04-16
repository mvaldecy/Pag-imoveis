package com.adm.imoveis.entities;

import java.util.List;

import com.adm.imoveis.entities.enums.ImovelStatus;
import com.adm.imoveis.entities.enums.ImovelTipo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "imovel")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Imovel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "predio_id")
	private Predio predio;

	@JsonIgnore
	@OneToMany(mappedBy = "imovel")
	private List<Contrato> contrato;
	
	private Double valor;

	@Enumerated(EnumType.STRING)
	private ImovelTipo tipo;

	private int tamanho;
	private String apto;

	@Enumerated(EnumType.STRING)
	private ImovelStatus status;

	@Lob
	@Column(columnDefinition = "TEXT")
	private String observacao;



	public Imovel() {}

	public Imovel(ImovelTipo tipo, int tamanho, String apto, ImovelStatus status, Double valor, String observacao) {
		this.tipo = tipo;
		this.tamanho = tamanho;
		this.apto = apto;
		this.status = status;
		this.valor = valor;
		this.observacao = observacao;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Predio getPredio() {
		return predio;
	}

	public void setPredio(Predio predio) {
		this.predio = predio;
	}

	public ImovelTipo getTipo() {
		return tipo;
	}

	public void setTipo(ImovelTipo tipo) {
		this.tipo = tipo;
	}

	public int getTamanho() {
		return tamanho;
	}

	public void setTamanho(int tamanho) {
		this.tamanho = tamanho;
	}

	public String getApto() {
		return apto;
	}

	public void setApto(String apto) {
		this.apto = apto;
	}

	public ImovelStatus getStatus() {
		return status;
	}

	public void setStatus(ImovelStatus status) {
		this.status = status;
	}

	public List<Contrato> getContrato() {
		return contrato;
	}

	public void setContrato(List<Contrato> contrato) {
		this.contrato = contrato;
	}

	public Double getValor() {
		return valor;
	}

	public void setValor(Double valor) {
		this.valor = valor;
	}

	public String getObservacao() {
		return observacao;
	}

	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}	

	

	
}
