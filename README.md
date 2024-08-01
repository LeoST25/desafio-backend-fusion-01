# Star Wars API

Esta API é um serviço RESTful desenvolvido em Node.js com Express e TypeScript para gerenciar dados relacionados a planetas, sistemas estelares, personagens e naves espaciais no universo Star Wars.

## Sumário

- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Autenticação](#autenticação)
- [Exemplos de Requisições e Respostas](#exemplos-de-requisições-e-respostas)
- [Documentação da API](#documentação-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Instalação

### Pré-requisitos

- Node.js (versão 16.x ou superior)
- npm (versão 7.x ou superior)
- MongoDB Atlas ou outro serviço MongoDB

### Passos para instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/LeoST98/desafio-backend-fusion-01.git
   cd desafio-backend-fusion-01

## Instale as dependências:
``` npm install ```

## Configure as variáveis de ambiente:
Crie um arquivo .env na raiz do projeto e adicione a URL de conexão do MongoDB:
``` 
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
```

## Inicie a API:
```
npm start
```
A API estará disponível em http://localhost:3000/api-docs

# Uso
- Para iniciar a API:
  Execute npm start para rodar o servidor localmente.
- Para testar a API:
  Utilize ferramentas como Postman ou cURL para enviar requisições HTTP para os endpoints descritos abaixo.

# Endpoints
  ## Planetas

### Listar Todos os Planetas

**GET** `/api/planets`

Retorna uma lista de todos os planetas.

---

### Criar um Novo Planeta

**POST** `/api/planets`

Cria um novo planeta.

---

### Atualizar um Planeta Existente

**PUT** `/api/planets/{id}`

Atualiza um planeta existente com o ID especificado.

---

### Deletar um Planeta Existente

**DELETE** `/api/planets/{id}`

Deleta um planeta existente com o ID especificado.

## Sistemas Solares
**GET** `/api/star-systems`

Retorna uma lista de todos os sistemas estelares.

---
**POST** `/api/star-systems`

Cria um novo sistema estelar.

---
**PUT** `/api/star-systems/{id}`

Atualiza um sistema estelar existente com o ID especificado.

## Deletar um Sistema Estelar Existente
**DELETE** `/api/star-systems/{id}`

Deleta um sistema estelar existente com o ID especificado.

## Personagens

### Listar Todos os Personagens

**GET** `/api/characters`

Retorna uma lista de todos os personagens.

---

### Criar um Novo Personagem

**POST** `/api/characters`

Cria um novo personagem.

---

### Atualizar um Personagem Existente

**PUT** `/api/characters/{id}`

Atualiza um personagem existente com o ID especificado.

---

### Deletar um Personagem Existente

**DELETE** `/api/characters/{id}`

Deleta um personagem existente com o ID especificado.

## Naves Espaciais

### Listar Todas as Naves Espaciais

**GET** `/api/spaceships`

Retorna uma lista de todas as naves espaciais.

---

### Criar uma Nova Nave Espacial

**POST** `/api/spaceships`

Cria uma nova nave espacial.

---

### Atualizar uma Nave Espacial Existente

**PUT** `/api/spaceships/{id}`

Atualiza uma nave espacial existente com o ID especificado.

---

### Deletar uma Nave Espacial Existente

**DELETE** `/api/spaceships/{id}`

Deleta uma nave espacial existente com o ID especificado.

## Autenticação

A API usa JSON Web Tokens (JWT) para autenticação.

### Autenticar um Usuário

**POST** `/api/login`

Autentica um usuário e retorna um token JWT. Envie o e-mail e a senha no corpo da requisição.

**Corpo da Requisição:**

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```
### Resposta:
```json
{
  "token": "your_jwt_token"
}
```
## Exemplos de Requisições e Respostas

### Exemplo de Requisição POST para Criar um Planeta

**Requisição:**

```http
POST /api/planets
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "nome": "Tatooine",
  "clima": "árido",
  "terreno": "deserto",
  "populacao": 200000
}
```
### Resposta:
```json
{
  "id": "63c8d1f5e4b0d9c49b13f12a",
  "nome": "Tatooine",
  "clima": "árido",
  "terreno": "deserto",
  "populacao": 200000
}
```
## Exemplo de Requisição GET para Listar Planetas
### Requisição:
```http
GET /api/planets
Authorization: Bearer <your_jwt_token>
```
### Resposta:
```json
[
  {
    "id": "63c8d1f5e4b0d9c49b13f12a",
    "nome": "Tatooine",
    "clima": "árido",
    "terreno": "deserto",
    "populacao": 200000
  },
  ...
]
```
## Exemplo de Requisição PUT para Atualizar um Planeta
### Requisição:
```http
PUT /api/planets/63c8d1f5e4b0d9c49b13f12a
Content-Type: application/json
Authorization: Bearer <your_jwt_token>

{
  "nome": "Tatooine",
  "clima": "árido",
  "terreno": "deserto",
  "populacao": 250000
}
```
### Resposta:
```json
{
  "id": "63c8d1f5e4b0d9c49b13f12a",
  "nome": "Tatooine",
  "clima": "árido",
  "terreno": "deserto",
  "populacao": 250000
}
```
## Exemplo de Requisição DELETE para Deletar um Planeta
### Requisição:
```http
DELETE /api/planets/63c8d1f5e4b0d9c49b13f12a
Authorization: Bearer <your_jwt_token>
```
### Resposta:
```json
{
  "message": "Planeta deletado com sucesso"
}
```
# Documentação da API
A documentação completa da API pode ser acessada usando Swagger, disponível em http://localhost:3000/api-docs após iniciar o servidor.

# Contribuição
Contribuições são bem-vindas! Se você deseja contribuir para o projeto, siga estes passos:

-  Fork o repositório.
-  Crie uma branch para sua feature (git checkout -b feature/MinhaFeature).
-  Faça as alterações e commit (git commit -am 'Adiciona nova feature').
-  Push para a branch (git push origin feature/MinhaFeature).
-  Crie um Pull Request.

# Licença
  Este projeto é licenciado sob a `MIT License`.