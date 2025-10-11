# Configuração Real do AWS Cognito

## Passo 1: Criar User Pool no AWS Console

1. Acesse o AWS Console: https://console.aws.amazon.com/
2. Vá para Amazon Cognito
3. Clique em "Create User Pool"

## Passo 2: Configuração do User Pool

### Etapa 1 - Configure sign-in experience
- **Authentication providers**: ☑️ User name
- **User name requirements**: ☑️ Email
- **Password policy**: 
  - Minimum length: 8 characters
  - ☑️ Contains at least 1 number
  - ☑️ Contains at least 1 special character
  - ☑️ Contains at least 1 uppercase letter
  - ☑️ Contains at least 1 lowercase letter

### Etapa 2 - Configure security requirements
- **Multi-factor authentication**: No MFA (para simplicidade)
- **User account recovery**: ☑️ Email only

### Etapa 3 - Configure sign-up experience
- **Self-registration**: ☑️ Enable self-registration
- **Attribute verification and user account confirmation**: ☑️ Send email verification message
- **Required attributes**: 
  - ☑️ email
  - ☑️ name (opcional, adicione 'affiliation' como custom attribute)

### Etapa 4 - Configure message delivery
- **Email provider**: ☑️ Send email with Cognito (para teste)
- **FROM email address**: no-reply@verificationemail.com (padrão)

### Etapa 5 - Integrate your app
- **User pool name**: `space-system-users`
- **App client name**: `space-system-app`
- **Client secret**: ☑️ Generate a client secret
- **Authentication flows**: ☑️ ALLOW_USER_PASSWORD_AUTH

## Passo 3: Após criar o User Pool

Você receberá:
1. **User Pool ID**: us-east-1_XXXXXXXXX
2. **App Client ID**: xxxxxxxxxxxxxxxxxxxx
3. **App Client Secret**: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

## Passo 4: Configurar as variáveis de ambiente

Substitua no arquivo .env:

```env
# AWS Cognito Configuration (SUBSTITUA COM OS VALORES REAIS)
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
COGNITO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Passo 5: Testar a configuração

1. Reinicie o backend
2. Acesse o frontend
3. Registre uma nova conta
4. Confirme pelo email
5. Faça login

## Links importantes:

- AWS Cognito Console: https://console.aws.amazon.com/cognito/
- Documentação: https://docs.aws.amazon.com/cognito/