# Script PowerShell para configurar AWS Cognito automaticamente

Write-Host "🚀 Configurando AWS Cognito para o Space System..." -ForegroundColor Green

# Verificar se AWS CLI está instalado
if (!(Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "❌ AWS CLI não encontrado." -ForegroundColor Red
    Write-Host "Instale primeiro: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html"
    Write-Host "Ou use: winget install Amazon.AWSCLI"
    exit 1
}

# Verificar se está logado no AWS
try {
    aws sts get-caller-identity --output json | Out-Null
    Write-Host "✅ AWS CLI configurado" -ForegroundColor Green
} catch {
    Write-Host "❌ Você precisa configurar suas credenciais AWS:" -ForegroundColor Red
    Write-Host "   Execute: aws configure"
    Write-Host "   Você precisará de:"
    Write-Host "   - AWS Access Key ID"
    Write-Host "   - AWS Secret Access Key" 
    Write-Host "   - Default region (recomendado: us-east-1)"
    exit 1
}

# Criar User Pool
Write-Host "📝 Criando User Pool..." -ForegroundColor Yellow

$userPoolCommand = @"
aws cognito-idp create-user-pool --pool-name "space-system-users" --policies '{\"PasswordPolicy\":{\"MinimumLength\":8,\"RequireUppercase\":true,\"RequireLowercase\":true,\"RequireNumbers\":true,\"RequireSymbols\":true}}' --auto-verified-attributes email --username-attributes email --verification-message-template '{\"DefaultEmailOption\":\"CONFIRM_WITH_CODE\"}' --query 'UserPool.Id' --output text
"@

$USER_POOL_ID = Invoke-Expression $userPoolCommand

if ([string]::IsNullOrEmpty($USER_POOL_ID)) {
    Write-Host "❌ Erro ao criar User Pool" -ForegroundColor Red
    exit 1
}

Write-Host "✅ User Pool criado: $USER_POOL_ID" -ForegroundColor Green

# Criar App Client
Write-Host "📝 Criando App Client..." -ForegroundColor Yellow

$clientCommand = @"
aws cognito-idp create-user-pool-client --user-pool-id "$USER_POOL_ID" --client-name "space-system-app" --generate-secret --explicit-auth-flows "ALLOW_USER_PASSWORD_AUTH" "ALLOW_REFRESH_TOKEN_AUTH" --query 'UserPoolClient.[ClientId,ClientSecret]' --output text
"@

$clientResponse = Invoke-Expression $clientCommand
$clientParts = $clientResponse -split '\t'
$CLIENT_ID = $clientParts[0]
$CLIENT_SECRET = $clientParts[1]

if ([string]::IsNullOrEmpty($CLIENT_ID) -or [string]::IsNullOrEmpty($CLIENT_SECRET)) {
    Write-Host "❌ Erro ao criar App Client" -ForegroundColor Red
    exit 1
}

Write-Host "✅ App Client criado: $CLIENT_ID" -ForegroundColor Green

# Atualizar arquivo .env
Write-Host "📝 Atualizando arquivo .env..." -ForegroundColor Yellow

# Backup do .env atual
Copy-Item .env .env.backup

# Ler conteúdo atual do .env
$envContent = Get-Content .env

# Atualizar as linhas do Cognito
$updatedContent = $envContent | ForEach-Object {
    if ($_ -match "^COGNITO_USER_POOL_ID=") {
        "COGNITO_USER_POOL_ID=$USER_POOL_ID"
    }
    elseif ($_ -match "^COGNITO_CLIENT_ID=") {
        "COGNITO_CLIENT_ID=$CLIENT_ID"
    }
    elseif ($_ -match "^COGNITO_CLIENT_SECRET=") {
        "COGNITO_CLIENT_SECRET=$CLIENT_SECRET"
    }
    else {
        $_
    }
}

# Salvar arquivo atualizado
$updatedContent | Set-Content .env

Write-Host "✅ Arquivo .env atualizado" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Configuração concluída com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Suas credenciais:" -ForegroundColor Cyan
Write-Host "   User Pool ID: $USER_POOL_ID"
Write-Host "   Client ID: $CLIENT_ID"
Write-Host "   Client Secret: $CLIENT_SECRET"
Write-Host ""
Write-Host "🚀 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Reinicie o backend: npm run dev"
Write-Host "   2. Acesse o frontend: http://localhost:5173"
Write-Host "   3. Registre uma nova conta"
Write-Host "   4. Verifique seu email para confirmação"
Write-Host "   5. Faça login com suas credenciais"
Write-Host ""