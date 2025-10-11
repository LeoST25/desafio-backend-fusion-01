# 🚀 Guia Prático: Configuração AWS Cognito User Pool

Este guia te levará passo-a-passo para configurar um User Pool real do AWS Cognito.

## 📋 Pré-requisitos

- [ ] Conta AWS ativa
- [ ] Acesso ao Console AWS
- [ ] Cartão de crédito vinculado (Cognito tem tier gratuito generoso)

## 🎯 Passo 1: Acessar AWS Cognito

1. **Login no Console AWS:** https://aws.amazon.com/console/
2. **Região:** Selecione `us-east-1` (N. Virginia) no canto superior direito
3. **Serviços:** Procure por "Cognito" ou vá em "Security, Identity & Compliance" > "Cognito"
4. **Clique em:** "User pools"

## 🛠️ Passo 2: Criar User Pool

### 2.1. Step 1 - Configure sign-in experience

**Authentication providers:**
- ✅ Cognito user pool
- ❌ Federated identity providers (deixar desmarcado por enquanto)

**Cognito user pool sign-in options:**
- ✅ **Email** (marcar esta opção)
- ❌ Username (deixar desmarcado)
- ❌ Phone number (deixar desmarcado)

**Clique:** "Next"

### 2.2. Step 2 - Configure security requirements

**Password policy:**
- Selecione: **"Cognito defaults"** ou customize:
  - Minimum length: 8
  - ✅ Contains at least 1 number
  - ✅ Contains at least 1 special character
  - ✅ Contains at least 1 uppercase letter
  - ✅ Contains at least 1 lowercase letter

**Multi-factor authentication:**
- Selecione: **"No MFA"** (para simplificar testes iniciais)

**User account recovery:**
- ✅ Enable self-service account recovery
- ✅ Email only

**Clique:** "Next"

### 2.3. Step 3 - Configure sign-up experience

**Self-service sign-up:**
- ✅ **Enable self-registration**

**Attribute verification and user account confirmation:**
- ✅ **Send email verification messages**
- ❌ Send SMS verification messages

**Verifying attribute changes:**
- ✅ **Keep original attribute value active when an update is pending**

**Required attributes:**
- ✅ **email** (obrigatório)
- Remover outros se houver

**Custom attributes:**
- **Clique "Add custom attribute"**
- Name: `affiliation`
- Type: `String`
- ✅ Mutable
- Min length: 1
- Max length: 20

**Clique:** "Next"

### 2.4. Step 4 - Configure message delivery

**Email:**
- Selecione: **"Send email with Cognito"**
- FROM email address: `no-reply@verificationemail.com` (padrão)

**SMS:** (pular por enquanto)

**Clique:** "Next"

### 2.5. Step 5 - Integrate your app

**User pool name:**
```
star-wars-user-pool
```

**Hosted authentication pages:**
- ✅ **Use the Cognito Hosted UI**

**Domain:**
- Domain type: **Use a Cognito domain**
- Cognito domain: `star-wars-auth-[SEU-NUMERO-UNICO]`
  - Exemplo: `star-wars-auth-123456`
  - **Clique "Check availability"** até encontrar um disponível

**Initial app client:**
- App client name: `star-wars-app`
- Client secret: ✅ **Generate a client secret**
- Authentication flows:
  - ✅ **ALLOW_USER_PASSWORD_AUTH**
  - ✅ **ALLOW_REFRESH_TOKEN_AUTH**
  - ❌ Outros (deixar desmarcados)

**Clique:** "Next"

### 2.6. Step 6 - Review and create

**Revise todas as configurações e clique:** "Create user pool"

## 🔑 Passo 3: Obter Credenciais

Após criar o User Pool:

### 3.1. User Pool ID
- Na página do User Pool criado
- **Copie:** User pool ID (formato: `us-east-1_XXXXXXXXX`)

### 3.2. Client ID e Secret
- Vá para a aba **"App integration"**
- Na seção **"App clients and analytics"**
- Clique no cliente **"star-wars-app"**
- **Copie:** Client ID
- **Copie:** Client secret (clique em "Show client secret")

### 3.3. Domain
- Na aba **"App integration"**
- Seção **"Domain"**
- **Copie:** Domain name (exemplo: `star-wars-auth-123456.auth.us-east-1.amazoncognito.com`)

## 📝 Passo 4: Configurar Aplicação

### 4.1. Atualizar arquivo .env

Substitua as variáveis placeholder no arquivo `.env`:

```bash
# AWS Cognito Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
COGNITO_DOMAIN=star-wars-auth-123456.auth.us-east-1.amazoncognito.com
```

### 4.2. Atualizar arquivo .env.docker

Copie as mesmas configurações para `.env.docker`

## 🧪 Passo 5: Testar Integração

### 5.1. Restart da Aplicação

```bash
# Parar containers
docker-compose down

# Rebuild com novas configurações
docker-compose up --build -d

# Verificar logs
docker-compose logs app
```

### 5.2. Verificar Status

```bash
curl http://localhost:3000/api/auth/status
```

**Resposta esperada:**
```json
{
  "cognitoConfigured": true,
  "region": "us-east-1",
  "userPoolId": "✓ Configurado",
  "clientId": "✓ Configurado",
  "clientSecret": "✓ Configurado",
  "domain": "✓ Configurado",
  "message": "AWS Cognito está configurado e pronto para uso!"
}
```

## 🎯 Passo 6: Teste Completo

### 6.1. Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "luke.skywalker@rebellion.com",
    "password": "ForceAwakens123!",
    "affiliation": "jedi"
  }'
```

### 6.2. Confirmar Conta

**Verificar email** e usar o código recebido:

```bash
curl -X POST http://localhost:3000/api/auth/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "email": "luke.skywalker@rebellion.com",
    "confirmationCode": "123456"
  }'
```

### 6.3. Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "luke.skywalker@rebellion.com",
    "password": "ForceAwakens123!"
  }'
```

**Salvar o accessToken da resposta**

### 6.4. Testar Rota Protegida

```bash
curl -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
     http://localhost:3000/api/protected
```

## 🌐 Passo 7: Testar Hosted UI (Opcional)

### 7.1. Obter URL de Login

```bash
curl http://localhost:3000/api/auth/login-url
```

### 7.2. Acessar no Navegador

- Copie a URL retornada
- Cole no navegador
- Faça login pela interface do Cognito
- Veja o processo completo de OAuth2

## 📊 Passo 8: Configurar Grupos (Opcional)

### 8.1. Criar Grupos no Console AWS

1. No User Pool, vá para **"Groups"**
2. **Clique:** "Create group"
3. **Grupos sugeridos:**
   - `Admins` - Administradores
   - `Jedis` - Usuários Jedi
   - `Siths` - Usuários Sith
   - `Rebels` - Rebeldes
   - `Empire` - Império

### 8.2. Adicionar Usuários aos Grupos

1. Vá para **"Users"**
2. Clique no usuário
3. Aba **"Group memberships"**
4. **Clique:** "Add user to group"

### 8.3. Testar Permissões por Grupo

```bash
# Requer grupo 'Admins'
curl -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
     http://localhost:3000/api/admin-only

# Requer afiliação 'jedi'
curl -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
     http://localhost:3000/api/jedi-only
```

## 💡 Dicas Importantes

### Custos AWS
- **Tier Gratuito:** 50.000 MAUs (Monthly Active Users)
- **Após tier gratuito:** $0.0055 por MAU
- **SMS:** Cobrança adicional se habilitado

### Segurança
- **Nunca commitar** credenciais reais no Git
- Use **diferentes User Pools** para dev/prod
- Configure **refresh tokens** para sessões longas

### Troubleshooting
- **"Invalid client":** Verifique Client ID/Secret
- **"User not confirmed":** Verifique email de confirmação
- **"Token expired":** Use refresh token ou faça login novamente

## 📱 Próximos Passos Sugeridos

1. **Frontend Integration:** Criar interface web para login
2. **Refresh Tokens:** Implementar renovação automática
3. **Social Logins:** Adicionar Google/Facebook
4. **Custom Attributes:** Expandir atributos Star Wars
5. **Lambda Triggers:** Personalizar fluxos de autenticação

---

**🎉 Parabéns! Sua API Star Wars agora tem autenticação enterprise-grade com AWS Cognito!**