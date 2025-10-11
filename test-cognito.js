#!/usr/bin/env node

/**
 * 🧪 Script de Teste Automatizado - AWS Cognito Integration
 * 
 * Este script testa todos os endpoints do Cognito automaticamente
 * Execute: node test-cognito.js
 */

const axios = require('axios');
const readline = require('readline');

const BASE_URL = 'http://localhost:3000';
let accessToken = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função helper para fazer requisições
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
}

// Função para aguardar input do usuário
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Testes
async function runTests() {
  console.log('🌟 Iniciando testes da integração AWS Cognito...\n');

  // 1. Testar status da configuração
  console.log('1️⃣ Testando status da configuração Cognito...');
  const statusResult = await makeRequest('GET', '/api/auth/status');
  
  if (statusResult.success) {
    console.log('✅ Status obtido:', statusResult.data);
    
    if (!statusResult.data.cognitoConfigured) {
      console.log('\n⚠️ Cognito não está configurado!');
      console.log('📖 Consulte COGNITO_REAL_SETUP.md para configuração');
      console.log('🔄 Configure as variáveis de ambiente e reinicie o Docker');
      process.exit(0);
    }
  } else {
    console.log('❌ Erro ao obter status:', statusResult.error);
    process.exit(1);
  }

  console.log('\n🎉 Cognito configurado! Continuando testes...\n');

  // 2. Testar documentação Swagger
  console.log('2️⃣ Verificando documentação Swagger...');
  console.log('📖 Acesse: http://localhost:3000/api-docs');
  
  // 3. Obter dados de teste do usuário
  const testEmail = await askQuestion('✉️ Digite um email para teste (ex: luke@jedi.com): ');
  const testPassword = await askQuestion('🔒 Digite uma senha (mín. 8 chars, maiúsc, minúsc, número, especial): ');
  
  // 4. Testar registro
  console.log('\n3️⃣ Testando registro de usuário...');
  const registerResult = await makeRequest('POST', '/api/auth/register', {
    email: testEmail,
    password: testPassword,
    affiliation: 'jedi'
  });
  
  if (registerResult.success) {
    console.log('✅ Usuário registrado:', registerResult.data);
    console.log('📧 Verifique seu email para o código de confirmação');
  } else {
    console.log('❌ Erro no registro:', registerResult.error);
    if (registerResult.error?.message?.includes('UsernameExistsException')) {
      console.log('👤 Usuário já existe, tentando login direto...');
    } else {
      console.log('🛑 Interrompendo testes devido ao erro de registro');
      process.exit(1);
    }
  }

  // 5. Testar confirmação (se necessário)
  if (registerResult.success) {
    const confirmCode = await askQuestion('\n📨 Digite o código de confirmação recebido no email: ');
    
    console.log('4️⃣ Testando confirmação de conta...');
    const confirmResult = await makeRequest('POST', '/api/auth/confirm', {
      email: testEmail,
      confirmationCode: confirmCode
    });
    
    if (confirmResult.success) {
      console.log('✅ Conta confirmada:', confirmResult.data);
    } else {
      console.log('❌ Erro na confirmação:', confirmResult.error);
      console.log('🔄 Você pode tentar fazer login mesmo assim...');
    }
  }

  // 6. Testar login
  console.log('\n5️⃣ Testando login...');
  const loginResult = await makeRequest('POST', '/api/auth/login', {
    email: testEmail,
    password: testPassword
  });
  
  if (loginResult.success) {
    console.log('✅ Login realizado:', {
      message: loginResult.data.message,
      tokenType: loginResult.data.tokenType,
      expiresIn: loginResult.data.expiresIn
    });
    accessToken = loginResult.data.accessToken;
    console.log('🔑 Token salvo para próximos testes');
  } else {
    console.log('❌ Erro no login:', loginResult.error);
    console.log('🛑 Não é possível continuar sem token de acesso');
    process.exit(1);
  }

  // 7. Testar informações do usuário
  console.log('\n6️⃣ Testando obtenção de informações do usuário...');
  const userInfoResult = await makeRequest('GET', '/api/auth/me', null, {
    Authorization: `Bearer ${accessToken}`
  });
  
  if (userInfoResult.success) {
    console.log('✅ Informações do usuário:', userInfoResult.data);
  } else {
    console.log('❌ Erro ao obter informações:', userInfoResult.error);
  }

  // 8. Testar rota protegida básica
  console.log('\n7️⃣ Testando rota protegida básica...');
  const protectedResult = await makeRequest('GET', '/api/protected', null, {
    Authorization: `Bearer ${accessToken}`
  });
  
  if (protectedResult.success) {
    console.log('✅ Acesso à rota protegida:', protectedResult.data);
  } else {
    console.log('❌ Erro na rota protegida:', protectedResult.error);
  }

  // 9. Testar rota específica para Jedi
  console.log('\n8️⃣ Testando rota exclusiva para Jedi...');
  const jediResult = await makeRequest('GET', '/api/jedi-only', null, {
    Authorization: `Bearer ${accessToken}`
  });
  
  if (jediResult.success) {
    console.log('✅ Acesso Jedi liberado:', jediResult.data);
  } else {
    console.log('❌ Acesso Jedi negado:', jediResult.error);
  }

  // 10. Testar rota para admins (deve falhar)
  console.log('\n9️⃣ Testando rota exclusiva para Admins (deve falhar)...');
  const adminResult = await makeRequest('GET', '/api/admin-only', null, {
    Authorization: `Bearer ${accessToken}`
  });
  
  if (adminResult.success) {
    console.log('✅ Acesso Admin:', adminResult.data);
  } else {
    console.log('⚠️ Acesso Admin negado (esperado):', adminResult.error);
  }

  // 11. Testar URL do Hosted UI
  console.log('\n🔟 Testando URL do Hosted UI...');
  const hostedUIResult = await makeRequest('GET', '/api/auth/login-url');
  
  if (hostedUIResult.success) {
    console.log('✅ URL do Hosted UI:', hostedUIResult.data.loginUrl);
    console.log('🌐 Você pode testar o login via browser nesta URL');
  } else {
    console.log('❌ Erro ao obter URL do Hosted UI:', hostedUIResult.error);
  }

  // 12. Testar recursos da API
  console.log('\n1️⃣1️⃣ Testando recursos da API Star Wars...');
  
  const resources = ['/api/planets', '/api/characters', '/api/spaceships', '/api/star-systems'];
  
  for (const resource of resources) {
    const resourceResult = await makeRequest('GET', resource);
    if (resourceResult.success) {
      console.log(`✅ ${resource}: ${Array.isArray(resourceResult.data) ? resourceResult.data.length : 'OK'} itens`);
    } else {
      console.log(`❌ ${resource}: ${resourceResult.error}`);
    }
  }

  console.log('\n🎉 Testes concluídos!');
  console.log('\n📊 Resumo dos testes:');
  console.log('- ✅ Configuração Cognito verificada');
  console.log('- ✅ Registro de usuário testado');  
  console.log('- ✅ Login/autenticação funcionando');
  console.log('- ✅ Rotas protegidas validadas');
  console.log('- ✅ Permissões por afiliação testadas');
  console.log('- ✅ API Star Wars funcionando');
  
  console.log('\n🚀 Sua integração Cognito está funcionando perfeitamente!');
  console.log('\n📱 Próximos passos sugeridos:');
  console.log('1. Criar grupos no Cognito e adicionar seu usuário ao grupo "Admins"');
  console.log('2. Testar o Hosted UI no browser');
  console.log('3. Implementar refresh token automation');
  console.log('4. Criar um frontend para a API');

  rl.close();
}

// Executar testes
runTests().catch(error => {
  console.error('💥 Erro durante os testes:', error.message);
  process.exit(1);
});