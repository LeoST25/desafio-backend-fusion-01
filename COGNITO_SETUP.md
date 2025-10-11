# 🌟 Star Wars API - AWS Cognito Integration

API Star Wars com autenticação AWS Cognito totalmente integrada. Gerencie a Galáxia com segurança enterprise-grade!

## 🚀 Configuração do AWS Cognito

### 1. Criar User Pool no AWS Cognito

1. Acesse o console da AWS e vá para **Cognito**
2. Clique em **Create User Pool**
3. Configure as seguintes opções:

#### Step 1: Sign-in Experience
- **Authentication providers**: `Email`
- **Cognito user pool sign-in options**: Marque `Email`

#### Step 2: Security Requirements
- **Password policy**: Use as configurações padrão ou customize conforme necessário
- **Multi-factor authentication**: `Optional` ou `Required` (conforme sua preferência)

#### Step 3: Sign-up Experience
- **Self-service sign-up**: `Enable`
- **Attribute verification and user account confirmation**: 
  - Marque `Send email verification messages`
- **Required attributes**: 
  - `email` (obrigatório)
- **Custom attributes**:
  - Adicione um atributo customizado chamado `affiliation` (tipo String, mutável)

#### Step 4: Message Delivery
- **Email provider**: Use `Send email with Cognito` para testes ou configure SES para produção

#### Step 5: Integrate Your App
- **User pool name**: `star-wars-user-pool`
- **App client name**: `star-wars-app`
- **Client secret**: `Generate client secret` (IMPORTANTE!)
- **Authentication flows**:
  - Marque `ALLOW_USER_PASSWORD_AUTH`
  - Marque `ALLOW_REFRESH_TOKEN_AUTH`

#### Step 6: Review and Create
- Revise todas as configurações e clique em **Create User Pool**

### 2. Configurar Domínio (Opcional - para Hosted UI)

1. No User Pool criado, vá para **App integration**
2. Clique em **Create domain** 
3. Escolha um nome único para o domínio (ex: `star-wars-auth-123`)

### 3. Configurar Variáveis de Ambiente

Após criar o User Pool, configure as seguintes variáveis nos arquivos `.env` e `.env.docker`:

```bash
# AWS Cognito Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_DOMAIN=star-wars-auth-123.auth.us-east-1.amazoncognito.com
```

## 🔧 Como Usar a API

### 1. Registro de Usuário

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "luke.skywalker@rebellion.com",
  "password": "ForceAwakens123!",
  "affiliation": "jedi"
}
```

### 2. Confirmação de Conta

Após o registro, o usuário receberá um email com código de verificação:

```bash
POST /api/auth/confirm
Content-Type: application/json

{
  "email": "luke.skywalker@rebellion.com",
  "confirmationCode": "123456"
}
```

### 3. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "luke.skywalker@rebellion.com",
  "password": "ForceAwakens123!"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "idToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiw...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### 4. Acessar Rotas Protegidas

Use o `accessToken` no cabeçalho Authorization:

```bash
GET /api/protected
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛡️ Tipos de Autenticação

### Autenticação por JWT (Recomendado)
- Use o `accessToken` retornado no login
- Formato: `Authorization: Bearer {accessToken}`
- Validação automática via middleware

### Hosted UI (OAuth2)
- Obtenha a URL do Hosted UI: `GET /api/auth/login-url`
- Redirecione o usuário para fazer login via interface da AWS
- Processe o callback com o código de autorização

## 🎯 Rotas Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/confirm` - Confirmar conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Informações do usuário autenticado
- `GET /api/auth/login-url` - URL do Hosted UI

### Rotas Protegidas
- `GET /api/protected` - Rota básica protegida
- `GET /api/jedi-only` - Requer afiliação 'jedi'
- `GET /api/admin-only` - Requer grupo 'Admins'

### Recursos da API
- `GET /api/planets` - Listar planetas
- `GET /api/characters` - Listar personagens
- `GET /api/spaceships` - Listar naves espaciais
- `GET /api/star-systems` - Listar sistemas estelares

## 📚 Documentação

Acesse a documentação interativa em: http://localhost:3000/api-docs

## 🏃‍♂️ Execução

### Desenvolvimento Local
```bash
npm run dev
```

### Com Docker
```bash
npm run docker:up
```

## 🔐 Grupos e Permissões

Você pode criar grupos no Cognito e usar o middleware `requireGroup()`:

1. No console do Cognito, vá para **Groups**
2. Crie grupos como: `Admins`, `Jedis`, `Siths`, etc.
3. Adicione usuários aos grupos
4. Use `requireGroup('Admins')` nas rotas que precisam de permissões específicas

## ⚠️ Notas Importantes

- O `CLIENT_SECRET` é obrigatório para este fluxo de autenticação
- Tokens têm expiração (padrão: 1 hora)
- Use `refreshToken` para obter novos `accessTokens`
- Mantenha as variáveis de ambiente seguras
- Para produção, configure domínio customizado e SES para emails

## 🆘 Troubleshooting

### "User Pool not found"
- Verifique se `COGNITO_USER_POOL_ID` está correto
- Confirme se a região está correta

### "Invalid client"
- Verifique `COGNITO_CLIENT_ID` e `COGNITO_CLIENT_SECRET`
- Confirme se o cliente foi criado com `CLIENT_SECRET`

### "Invalid token"
- Token expirado ou inválido
- Faça login novamente ou use refresh token