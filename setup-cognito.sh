#!/bin/bash

# Script para configurar AWS Cognito automaticamente
# Execute: npm run setup-cognito

echo "🚀 Configurando AWS Cognito para o Space System..."

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI não encontrado. Instale primeiro:"
    echo "   Windows: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html"
    echo "   Mac: brew install awscli"
    echo "   Linux: sudo apt install awscli"
    exit 1
fi

# Verificar se está logado no AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Você precisa configurar suas credenciais AWS:"
    echo "   Execute: aws configure"
    echo "   Você precisará de:"
    echo "   - AWS Access Key ID"
    echo "   - AWS Secret Access Key" 
    echo "   - Default region (recomendado: us-east-1)"
    exit 1
fi

echo "✅ AWS CLI configurado"

# Criar User Pool
echo "📝 Criando User Pool..."

USER_POOL_ID=$(aws cognito-idp create-user-pool \
    --pool-name "space-system-users" \
    --policies '{
        "PasswordPolicy": {
            "MinimumLength": 8,
            "RequireUppercase": true,
            "RequireLowercase": true,
            "RequireNumbers": true,
            "RequireSymbols": true
        }
    }' \
    --auto-verified-attributes email \
    --username-attributes email \
    --verification-message-template '{
        "DefaultEmailOption": "CONFIRM_WITH_CODE"
    }' \
    --query 'UserPool.Id' \
    --output text)

if [ -z "$USER_POOL_ID" ]; then
    echo "❌ Erro ao criar User Pool"
    exit 1
fi

echo "✅ User Pool criado: $USER_POOL_ID"

# Criar App Client
echo "📝 Criando App Client..."

CLIENT_RESPONSE=$(aws cognito-idp create-user-pool-client \
    --user-pool-id "$USER_POOL_ID" \
    --client-name "space-system-app" \
    --generate-secret \
    --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" \
    --query 'UserPoolClient.[ClientId,ClientSecret]' \
    --output text)

CLIENT_ID=$(echo $CLIENT_RESPONSE | cut -d' ' -f1)
CLIENT_SECRET=$(echo $CLIENT_RESPONSE | cut -d' ' -f2)

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo "❌ Erro ao criar App Client"
    exit 1
fi

echo "✅ App Client criado: $CLIENT_ID"

# Atualizar arquivo .env
echo "📝 Atualizando arquivo .env..."

# Backup do .env atual
cp .env .env.backup

# Atualizar as variáveis do Cognito
sed -i.bak \
    -e "s/^COGNITO_USER_POOL_ID=.*/COGNITO_USER_POOL_ID=$USER_POOL_ID/" \
    -e "s/^COGNITO_CLIENT_ID=.*/COGNITO_CLIENT_ID=$CLIENT_ID/" \
    -e "s/^COGNITO_CLIENT_SECRET=.*/COGNITO_CLIENT_SECRET=$CLIENT_SECRET/" \
    .env

echo "✅ Arquivo .env atualizado"

echo ""
echo "🎉 Configuração concluída com sucesso!"
echo ""
echo "📋 Suas credenciais:"
echo "   User Pool ID: $USER_POOL_ID"
echo "   Client ID: $CLIENT_ID"
echo "   Client Secret: $CLIENT_SECRET"
echo ""
echo "🚀 Próximos passos:"
echo "   1. Reinicie o backend: npm run dev"
echo "   2. Acesse o frontend: http://localhost:5173"
echo "   3. Registre uma nova conta"
echo "   4. Verifique seu email para confirmação"
echo "   5. Faça login com suas credenciais"
echo ""