import { Request, Response } from 'express';
import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, AdminGetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../middleware/cognitoAuthMiddleware';

dotenv.config();

// Configurações do Cognito
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;

// Cliente do AWS Cognito (só criar se configurado)
let cognitoClient: CognitoIdentityProviderClient | null = null;

if (USER_POOL_ID && CLIENT_ID && CLIENT_SECRET && 
    USER_POOL_ID !== 'your-user-pool-id-here' && 
    CLIENT_ID !== 'your-client-id-here') {
  cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION || 'us-east-1'
  });
  console.log('✅ Cognito Client inicializado com sucesso');
} else {
  console.warn('⚠️ Cognito não configurado. Configure USER_POOL_ID, CLIENT_ID e CLIENT_SECRET no .env');
}

/**
 * Gera o hash SECRET necessário para operações do Cognito
 */
function generateSecretHash(username: string): string {
  return crypto
    .createHmac('sha256', CLIENT_SECRET)
    .update(username + CLIENT_ID)
    .digest('base64');
}

/**
 * Registro de novo usuário no Cognito
 */
export const registerController = async (req: Request, res: Response): Promise<void> => {
  if (!cognitoClient || !CLIENT_ID) {
    res.status(500).json({
      error: 'Cognito not configured',
      message: 'AWS Cognito não está configurado. Consulte COGNITO_SETUP.md para configuração.'
    });
    return;
  }

  const { email, password, affiliation } = req.body;

  if (!email || !password) {
    res.status(400).json({ 
      error: 'Missing fields',
      message: 'Email e senha são obrigatórios' 
    });
    return;
  }

  try {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: generateSecretHash(email),
      UserAttributes: [
        {
          Name: 'email',
          Value: email
        },
        // Adicionar afiliação como atributo customizado se fornecida
        ...(affiliation ? [{
          Name: 'custom:affiliation',
          Value: affiliation
        }] : [])
      ]
    });

    const response = await cognitoClient.send(command);

    res.status(201).json({
      message: 'Usuário registrado com sucesso. Verifique seu email para confirmar a conta.',
      userSub: response.UserSub,
      codeDeliveryDetails: response.CodeDeliveryDetails
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    // Tratar erros específicos do Cognito
    if (errorMessage.includes('UsernameExistsException')) {
      res.status(400).json({
        error: 'User already exists',
        message: 'Usuário já existe com este email'
      });
      return;
    }
    
    if (errorMessage.includes('InvalidPasswordException')) {
      res.status(400).json({
        error: 'Invalid password',
        message: 'Senha não atende aos critérios de segurança'
      });
      return;
    }
    
    res.status(500).json({
      error: 'Registration failed',
      message: 'Erro interno do servidor',
      details: errorMessage
    });
  }
};

/**
 * Confirmação de registro via código enviado por email
 */
export const confirmSignUpController = async (req: Request, res: Response): Promise<void> => {
  const { email, confirmationCode } = req.body;

  if (!email || !confirmationCode) {
    res.status(400).json({
      error: 'Missing fields',
      message: 'Email e código de confirmação são obrigatórios'
    });
    return;
  }

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
      SecretHash: generateSecretHash(email)
    });

    await cognitoClient.send(command);

    res.json({
      message: 'Conta confirmada com sucesso. Você pode fazer login agora.'
    });
  } catch (error) {
    console.error('Erro na confirmação:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    if (errorMessage.includes('CodeMismatchException')) {
      res.status(400).json({
        error: 'Invalid code',
        message: 'Código de confirmação inválido'
      });
      return;
    }
    
    if (errorMessage.includes('ExpiredCodeException')) {
      res.status(400).json({
        error: 'Expired code',
        message: 'Código de confirmação expirado'
      });
      return;
    }
    
    res.status(500).json({
      error: 'Confirmation failed',
      message: 'Erro na confirmação da conta',
      details: errorMessage
    });
  }
};

/**
 * Login do usuário - retorna tokens do Cognito
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      error: 'Missing credentials',
      message: 'Email e senha são obrigatórios'
    });
    return;
  }

  try {
    const command = new InitiateAuthCommand({
      ClientId: CLIENT_ID,
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: generateSecretHash(email)
      }
    });

    const response = await cognitoClient.send(command);

    if (response.AuthenticationResult) {
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          accessToken: response.AuthenticationResult.AccessToken,
          idToken: response.AuthenticationResult.IdToken,
          refreshToken: response.AuthenticationResult.RefreshToken,
          expiresIn: response.AuthenticationResult.ExpiresIn,
          tokenType: response.AuthenticationResult.TokenType
        }
      });
    } else if (response.ChallengeName === 'SMS_MFA') {
      // MFA é obrigatório
      res.status(200).json({
        success: false,
        requiresMfa: true,
        challengeName: response.ChallengeName,
        session: response.Session,
        message: 'Verificação MFA necessária. Código SMS foi enviado.'
      });
    } else if (response.ChallengeName) {
      // Outros desafios
      res.status(200).json({
        success: false,
        challengeName: response.ChallengeName,
        session: response.Session,
        message: `Desafio ${response.ChallengeName} necessário.`
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Autenticação incompleta. Pode ser necessária confirmação adicional.'
      });
    }
  } catch (error) {
    console.error('Erro no login:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    if (errorMessage.includes('NotAuthorizedException')) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email ou senha incorretos'
      });
      return;
    }
    
    if (errorMessage.includes('UserNotConfirmedException')) {
      res.status(400).json({
        error: 'User not confirmed',
        message: 'Usuário não confirmado. Verifique seu email.'
      });
      return;
    }
    
    res.status(500).json({
      error: 'Login failed',
      message: 'Erro interno no login',
      details: errorMessage
    });
  }
};

/**
 * Obter informações do usuário autenticado
 */
export const getUserInfoController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Not authenticated',
        message: 'Usuário não autenticado'
      });
      return;
    }

    // Buscar informações detalhadas do usuário
    const command = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: req.user.sub
    });

    const userDetails = await cognitoClient.send(command);

    // Extrair atributos do usuário
    const userAttributes = {};
    userDetails.UserAttributes?.forEach(attr => {
      if (attr.Name && attr.Value) {
        userAttributes[attr.Name] = attr.Value;
      }
    });

    res.json({
      userId: req.user.sub,
      username: req.user.username,
      email: userAttributes['email'],
      affiliation: userAttributes['custom:affiliation'],
      groups: req.user['cognito:groups'] || [],
      userStatus: userDetails.UserStatus,
      userAttributes
    });
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    
    res.status(500).json({
      error: 'Failed to get user info',
      message: 'Erro ao buscar informações do usuário'
    });
  }
};

/**
 * Endpoint para obter URL de login do Cognito (Hosted UI)
 */
export const getLoginUrlController = (req: Request, res: Response): void => {
  if (!cognitoClient || !CLIENT_ID) {
    res.status(500).json({
      error: 'Cognito not configured',
      message: 'AWS Cognito não está configurado. Consulte COGNITO_SETUP.md para configuração.'
    });
    return;
  }

  const cognitoDomain = process.env.COGNITO_DOMAIN;
  const redirectUri = req.query.redirect_uri || 'http://localhost:3000/api/auth/callback';
  
  if (!cognitoDomain) {
    res.status(500).json({
      error: 'Configuration error',
      message: 'Domínio do Cognito não configurado'
    });
    return;
  }

  const loginUrl = `https://${cognitoDomain}/login?` +
    `client_id=${CLIENT_ID}&` +
    `response_type=code&` +
    `scope=email+openid+profile&` +
    `redirect_uri=${encodeURIComponent(redirectUri as string)}`;

  res.json({
    loginUrl,
    message: 'Use esta URL para fazer login via interface do Cognito'
  });
};

/**
 * Endpoint para verificar status da configuração do Cognito
 */
export const getCognitoStatusController = (req: Request, res: Response): void => {
  const isConfigured = !!(cognitoClient && USER_POOL_ID && CLIENT_ID && CLIENT_SECRET);
  
  res.json({
    cognitoConfigured: isConfigured,
    region: process.env.AWS_REGION || 'us-east-1',
    userPoolId: USER_POOL_ID ? '✓ Configurado' : '✗ Não configurado',
    clientId: CLIENT_ID ? '✓ Configurado' : '✗ Não configurado', 
    clientSecret: CLIENT_SECRET ? '✓ Configurado' : '✗ Não configurado',
    domain: process.env.COGNITO_DOMAIN ? '✓ Configurado' : '✗ Não configurado',
    message: isConfigured 
      ? 'AWS Cognito está configurado e pronto para uso!'
      : 'AWS Cognito não está configurado. Consulte COGNITO_SETUP.md para instruções.',
    setupGuide: 'Consulte o arquivo COGNITO_SETUP.md para instruções completas de configuração.'
  });
};

/**
 * Habilitar MFA por SMS para um usuário
 */
export const enableMfaController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!cognitoClient) {
    res.status(500).json({
      error: 'Cognito not configured',
      message: 'AWS Cognito não está configurado.'
    });
    return;
  }

  try {
    const { phoneNumber } = req.body;
    const username = req.user?.username;

    if (!username) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    if (!phoneNumber) {
      res.status(400).json({
        success: false,
        message: 'Número de telefone é obrigatório'
      });
      return;
    }

    // Importar comandos necessários
    const { AdminSetUserMFAPreferenceCommand, AdminUpdateUserAttributesCommand } = await import('@aws-sdk/client-cognito-identity-provider');

    // Primeiro, atualizar o número de telefone do usuário
    const updatePhoneCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      UserAttributes: [
        {
          Name: 'phone_number',
          Value: phoneNumber
        },
        {
          Name: 'phone_number_verified',
          Value: 'true'
        }
      ]
    });

    await cognitoClient.send(updatePhoneCommand);

    // Habilitar MFA por SMS
    const enableMfaCommand = new AdminSetUserMFAPreferenceCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      SMSMfaSettings: {
        Enabled: true,
        PreferredMfa: true
      }
    });

    await cognitoClient.send(enableMfaCommand);

    res.json({
      success: true,
      message: 'MFA habilitado com sucesso!',
      data: {
        mfaEnabled: true,
        phoneNumber: phoneNumber
      }
    });

  } catch (error: any) {
    console.error('Erro ao habilitar MFA:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

/**
 * Desabilitar MFA para um usuário
 */
export const disableMfaController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!cognitoClient) {
    res.status(500).json({
      error: 'Cognito not configured',
      message: 'AWS Cognito não está configurado.'
    });
    return;
  }

  try {
    const username = req.user?.username;

    if (!username) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    const { AdminSetUserMFAPreferenceCommand } = await import('@aws-sdk/client-cognito-identity-provider');

    // Desabilitar MFA
    const disableMfaCommand = new AdminSetUserMFAPreferenceCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      SMSMfaSettings: {
        Enabled: false,
        PreferredMfa: false
      }
    });

    await cognitoClient.send(disableMfaCommand);

    res.json({
      success: true,
      message: 'MFA desabilitado com sucesso!',
      data: {
        mfaEnabled: false
      }
    });

  } catch (error: any) {
    console.error('Erro ao desabilitar MFA:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

/**
 * Verificar status do MFA para um usuário
 */
export const getMfaStatusController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!cognitoClient) {
    res.status(500).json({
      error: 'Cognito not configured',
      message: 'AWS Cognito não está configurado.'
    });
    return;
  }

  try {
    const username = req.user?.username;

    if (!username) {
      res.status(401).json({
        success: false,
        message: 'Usuário não autenticado'
      });
      return;
    }

    const { AdminGetUserCommand } = await import('@aws-sdk/client-cognito-identity-provider');

    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username
    });

    const result = await cognitoClient.send(getUserCommand);

    // Verificar se MFA está habilitado
    const mfaOptions = result.MFAOptions || [];
    const isMfaEnabled = mfaOptions.length > 0;
    
    // Buscar número de telefone
    const phoneNumberAttr = result.UserAttributes?.find(attr => attr.Name === 'phone_number');
    const phoneNumber = phoneNumberAttr?.Value;

    res.json({
      success: true,
      data: {
        mfaEnabled: isMfaEnabled,
        mfaOptions: mfaOptions,
        phoneNumber: phoneNumber,
        preferredMfaSetting: result.PreferredMfaSetting
      }
    });

  } catch (error: any) {
    console.error('Erro ao verificar status do MFA:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erro interno do servidor'
    });
  }
};

/**
 * Responder ao desafio MFA durante o login
 */
export const respondMfaChallengeController = async (req: Request, res: Response): Promise<void> => {
  if (!cognitoClient) {
    res.status(500).json({
      error: 'Cognito not configured',
      message: 'AWS Cognito não está configurado.'
    });
    return;
  }

  try {
    const { session, mfaCode, username } = req.body;

    if (!session || !mfaCode || !username) {
      res.status(400).json({
        success: false,
        message: 'Session, código MFA e username são obrigatórios'
      });
      return;
    }

    const { RespondToAuthChallengeCommand } = await import('@aws-sdk/client-cognito-identity-provider');

    const respondCommand = new RespondToAuthChallengeCommand({
      ClientId: CLIENT_ID,
      ChallengeName: 'SMS_MFA',
      Session: session,
      ChallengeResponses: {
        SMS_MFA_CODE: mfaCode,
        USERNAME: username,
        SECRET_HASH: generateSecretHash(username)
      }
    });

    const result = await cognitoClient.send(respondCommand);

    if (result.AuthenticationResult) {
      res.json({
        success: true,
        message: 'MFA verificado com sucesso!',
        data: {
          accessToken: result.AuthenticationResult.AccessToken,
          idToken: result.AuthenticationResult.IdToken,
          refreshToken: result.AuthenticationResult.RefreshToken,
          tokenType: result.AuthenticationResult.TokenType,
          expiresIn: result.AuthenticationResult.ExpiresIn
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Falha na verificação do MFA'
      });
    }

  } catch (error: any) {
    console.error('Erro ao responder desafio MFA:', error);
    
    if (error.name === 'CodeMismatchException') {
      res.status(400).json({
        success: false,
        message: 'Código MFA inválido'
      });
    } else if (error.name === 'ExpiredCodeException') {
      res.status(400).json({
        success: false,
        message: 'Código MFA expirado'
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Erro interno do servidor'
      });
    }
  }
};