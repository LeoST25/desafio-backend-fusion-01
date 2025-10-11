# 🚀 CONFIGURAÇÃO MANUAL DO AWS COGNITO

## Opção 1: Configuração Automática (Recomendada)

Se você tem AWS CLI instalado e configurado:

```bash
npm run setup-cognito
```

## Opção 2: Configuração Manual no AWS Console

### Passo 1: Acessar AWS Console

1. Acesse: https://console.aws.amazon.com/cognito/
2. Faça login com sua conta AWS
3. Selecione a região **us-east-1** (N. Virginia)

### Passo 2: Criar User Pool

1. Clique em **"Create User Pool"**
2. **Pool name**: `space-system-users`

### Passo 3: Configurar Sign-in

- ☑️ **Email** (como username)
- **Password policy**: 
  - Minimum length: 8
  - ☑️ Require uppercase
  - ☑️ Require lowercase  
  - ☑️ Require numbers
  - ☑️ Require symbols

### Passo 4: Configurar Sign-up

- ☑️ **Enable self-registration**
- ☑️ **Email verification**
- **Required attributes**: email

### Passo 5: Configurar App Client

1. **App client name**: `space-system-app`
2. ☑️ **Generate client secret**
3. **Authentication flows**: 
   - ☑️ **ALLOW_USER_PASSWORD_AUTH**
   - ☑️ **ALLOW_REFRESH_TOKEN_AUTH**

### Passo 6: Copiar Credenciais

Após criar, você receberá:

- **User Pool ID**: `us-east-1_XXXXXXXXX`
- **App Client ID**: `1a2b3c4d5e6f7g8h9i0j`
- **App Client Secret**: `abc123def456ghi789jkl...`

### Passo 7: Atualizar .env

Edite o arquivo `.env` e substitua:

```env
# AWS Cognito Configuration
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j
COGNITO_CLIENT_SECRET=abc123def456ghi789jkl...
```

### Passo 8: Reiniciar Backend

```bash
npm run dev
```

## Opção 3: Usar Cognito de Teste (Temporário)

Se você quer testar rapidamente, posso configurar um Cognito de desenvolvimento temporário.

### 📧 Precisamos do seu email

Para configurar o Cognito, preciso saber qual email você quer usar para:
1. Receber códigos de verificação
2. Fazer login no sistema

**Me informe seu email e eu configuro tudo para você!**

## Problemas Comuns

### ❌ "User does not exist"
- Você precisa registrar uma conta primeiro
- Use a aba "Registrar" no frontend

### ❌ "User is not confirmed"  
- Verifique seu email para o código de confirmação
- Use a aba "Confirmar" no frontend

### ❌ "Invalid password"
- A senha deve ter pelo menos 8 caracteres
- Deve conter: maiúscula, minúscula, número e símbolo

### ❌ Variáveis não configuradas
- Verifique se o arquivo .env tem as credenciais corretas
- Reinicie o backend após alterar o .env