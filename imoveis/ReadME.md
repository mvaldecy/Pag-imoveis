# 🏠 Pag Imóveis API

API REST desenvolvida em **Spring Boot** para o gerenciamento de imóveis, contratos, repasses e inquilinos vinculados a uma ou mais imobiliárias.

---

## ⚙️ Tecnologias Utilizadas

- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL (ou MySQL)
- OpenAPI (Swagger)

---

## 🧩 Entidades Principais

| Entidade      | Descrição |
|---------------|-----------|
| Imobiliária   | Gerencia inquilinos e contratos |
| Inquilino     | Pessoa associada a uma imobiliária |
| Contrato      | Vínculo entre inquilino e imóvel |
| Repasse       | Pagamento mensal de contrato |
| Imóvel        | Unidade em um prédio |
| Prédio        | Conjunto de imóveis |

---

## 🔗 Endpoints e Estrutura de Dados

> Base URL: `http://localhost:8083`

### 🏢 Imobiliária

#### `POST /imobiliaria`

**Requisição:**
```json
{
  "nome": "Imobiliária Central"
}
```

**Resposta:**
```json
{
  "id": 1,
  "nome": "Imobiliária Central",
  "inquilinos": [],
  "contratos": []
}
```

#### `GET /imobiliaria/{id}`

**Resposta:**
```json
{
  "id": 1,
  "nome": "Imobiliária Central",
  "inquilinos": [ ... ],
  "contratos": [ ... ]
}
```

#### `PUT /imobiliaria/{id}`

**Requisição:**
```json
{
  "nome": "Imobiliária Atualizada"
}
```

**Resposta:** igual ao `GET /imobiliaria/{id}`

#### `DELETE /imobiliaria/{id}`  
**Resposta:**
```json
"Imobiliária removida com sucesso"
```

---

### 👤 Inquilino

#### `POST /inquilino`

**Requisição:**
```json
{
  "nome": "João da Silva",
  "cpf": "123.456.789-00",
  "status": "ATIVO",
  "imobiliariaId": 1
}
```

**Resposta:**
```json
{
  "id": 5,
  "cpf": "123.456.789-00",
  "nome": "João da Silva",
  "status": "ATIVO",
  "imobiliaria": {
    "imobiliariaId": 1,
    "imobiliariaNome": "Imobiliária Central"
  },
  "contratos": []
}
```

#### `GET /inquilino/{id}`  
**Resposta:** igual ao `POST`.

#### `GET /inquilinoByCpf?Cpf=123.456.789-00`  
**Resposta:** igual ao `POST`.

---

### 🏘️ Imóvel

#### `POST /imovel`

**Requisição:**
```json
{
  "apto": "101",
  "status": "DISPONIVEL",
  "tamanho": 60,
  "tipo": "APARTAMENTO",
  "predioId": 1,
  "valor": 1250.00
}
```

**Resposta:**
```json
{
  "id": 10,
  "tipo": "APARTAMENTO",
  "tamanho": 60,
  "apto": "101",
  "status": "DISPONIVEL",
  "predio": {
    "id": 1,
    "nome": "Residencial Alfa",
    "endereco": "Rua A, 1000"
  }
}
```

#### `GET /imovel/{id}`  
**Resposta:** igual ao `POST`.

#### `GET /imovelByPredioId/{id}`  
**Resposta:** lista de imóveis por prédio.

---

### 🏢 Prédio

#### `POST /predio`

**Requisição:**
```json
{
  "nome": "Residencial Alfa",
  "endereco": "Rua A, 1000",
  "latitude": "-5.089",
  "longitude": "-42.801",
  "link": "https://maps.example.com"
}
```

**Resposta:**
```json
{
  "id": 1,
  "nome": "Residencial Alfa",
  "endereco": "Rua A, 1000",
  "imoveis": []
}
```

#### `GET /predio/{id}`  
**Resposta:** igual ao `POST`.

---

### 📄 Contrato

#### `POST /contrato`

**Requisição:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "imobiliariaId": 1,
  "imovelId": 10,
  "inquilinoid": 5
}
```

**Resposta:**
```json
{
  "id": 8,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31",
  "imobiliaria": { ... },
  "imovel": { ... },
  "repasse": []
}
```

#### `GET /contrato/{id}`  
**Resposta:** igual ao `POST`.

---

### 💰 Repasse

#### `POST /repasse`

**Requisição:**
```json
{
  "valorRepasse": 1250.0,
  "dataRepasse": "2024-03-10",
  "contratoId": 8
}
```

**Resposta:**
```json
{
  "id": 2,
  "dataRepasse": "2024-03-10",
  "valorRepasse": 1250.0,
  "contrato": {
    "contratoId": 8,
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "imovelId": 10,
    "inquilinoId": 5,
    "imobiliariaId": 1
  }
}
```

#### `GET /repasse`  
**Resposta:** lista de repasses.

---

## 🧪 Exceções Tratadas

| Exceção                 | Código | Mensagem                      |
|-------------------------|--------|-------------------------------|
| ImovelNotFound          | 404    | Imovel não encontrado         |
| PredioNotFound          | 404    | Predio não encontrado         |
| InquilinoNotFound       | 404    | Inquilino não encontrado      |
| ImobiliariaNotFound     | 404    | Imobiliária não encontrada    |
| ContratoNotFound        | 404    | Contrato não encontrado       |
| RepasseNotFound         | 404    | Repasse não encontrado        |

---

## 📂 Organização do Projeto

```
src/
├── controller/
├── dto/
├── entities/
├── repositories/
├── service/
├── service/exception/
└── utils/
```
---

## 🐳 Instruções para Rodar com Docker

Para subir o projeto com Docker, utilize o seguinte comando:

```bash
docker-compose up --build
```

---
