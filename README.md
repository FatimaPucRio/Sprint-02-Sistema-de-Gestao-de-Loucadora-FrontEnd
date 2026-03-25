# 🎬 Sistema de Gestão de Filmes — Frontend

Projeto de interface (Front-End) desenvolvido como parte do MVP para a disciplina **Desenvolvimento Full Stack Avançado** da PUC-Rio.

<img width="1031" height="648" alt="image" src="https://github.com/user-attachments/assets/aa75a893-f11f-4c37-bdb0-f456630318c1" />

O projeto implementa o **Cenário 1** proposto: uma interface de sistema baseada na busca de filmes através de um serviço externo (TMDB / Fake Store API) e na gestão de cadastro de clientes, utilizando uma API própria (Back-End) para efetivar o registro e a persistência das informações no banco de dados.

---

## 🏗️ Arquitetura

Conforme ilustrado no diagrama da arquitetura, a solução funciona da seguinte forma:

| Camada | Descrição |
|---|---|
| **Interface (Front-End)** | SPA onde o usuário realiza a busca de filmes e preenche o cadastro |
| **API Externa** | Fornece os dados do catálogo de filmes em tempo real |
| **API Interna (Back-End Flask)** | Responsável por processar e salvar os dados dos clientes |
| **Persistência (SQLite)** | Banco de dados onde as informações dos clientes são armazenadas com segurança |

---

## 🛠️ Tecnologias Utilizadas

- **Front-End:** HTML5, CSS3, JavaScript (Vanilla)
- **Comunicação:** Fetch API (JSON / HTTP)
- **Containerização:** Docker e Docker Compose
- **Servidor Web:** Nginx (dentro do container Docker)

---

## 🚀 Como Executar

### Via Docker

```bash
docker build -t locadora-frontend .
docker run -p 80:80 locadora-frontend
```

### Via Docker Compose

```bash
docker-compose up --build
```

---

## 🌐 Acesso ao Sistema

Após iniciar o container, acesse a interface através do navegador:

```
http://localhost:8080
```
