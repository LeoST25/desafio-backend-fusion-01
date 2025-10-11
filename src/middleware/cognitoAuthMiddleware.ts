import { Request, Response, NextFunction } from 'express';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import dotenv from 'dotenv';

dotenv.config();

// Verificar se as variáveis de ambiente do Cognito estão configuradas
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// Verificador de JWT do Cognito (só criar se as variáveis estiverem configuradas)
let verifier: any = null;

if (COGNITO_USER_POOL_ID && COGNITO_CLIENT_ID && 
    COGNITO_USER_POOL_ID !== 'your-user-pool-id-here' && 
    COGNITO_CLIENT_ID !== 'your-client-id-here' &&
    COGNITO_USER_POOL_ID !== 'us-east-1_temp_dev' &&
    COGNITO_CLIENT_ID !== 'temp_dev_client_id') {
  try {
    verifier = CognitoJwtVerifier.create({
      userPoolId: COGNITO_USER_POOL_ID,
      tokenUse: "access",
      clientId: COGNITO_CLIENT_ID,
    });
    console.log('✅ Cognito JWT Verifier inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Cognito JWT Verifier:', error);
  }
} else {
  console.warn('⚠️ Variáveis do Cognito não configuradas. Configure COGNITO_USER_POOL_ID e COGNITO_CLIENT_ID no .env');
}

// Interface para o payload do usuário Cognito
interface CognitoUserPayload {
  sub: string; // ID único do usuário
  email?: string;
  username?: string;
  'custom:affiliation'?: string;
  'cognito:groups'?: string[];
  client_id: string;
  token_use: string;
}

// Extensão da interface Request para incluir dados do usuário
export interface AuthenticatedRequest extends Request {
  user?: CognitoUserPayload;
}

/**
 * Middleware de autenticação usando AWS Cognito
 * Verifica tokens JWT emitidos pelo Cognito User Pool
 */
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Verificar se o Cognito está configurado
    if (!verifier) {
      return res.status(500).json({
        error: 'Cognito not configured',
        message: 'AWS Cognito não está configurado. Configure as variáveis de ambiente COGNITO_USER_POOL_ID e COGNITO_CLIENT_ID.',
        hint: 'Consulte COGNITO_SETUP.md para instruções de configuração'
      });
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Token de autorização não fornecido' 
      });
    }

    // Verificar e decodificar o token JWT do Cognito
    const payload = await verifier.verify(token);
    
    // Adicionar dados do usuário ao request
    req.user = payload as CognitoUserPayload;
    
    next();
  } catch (error) {
    console.error('Erro na verificação do token Cognito:', error);
    
    // Tratamento específico de erros
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    if (errorName === 'JwtExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Token expirado, faça login novamente'
      });
    }
    
    if (errorName === 'JwtParseError') {
      return res.status(400).json({
        error: 'Invalid token format',
        message: 'Formato de token inválido'
      });
    }
    
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Token inválido ou não autorizado',
      details: errorMessage
    });
  }
};

/**
 * Middleware para verificar se o usuário tem uma afiliação específica
 * @param requiredAffiliation - Afiliação requerida (ex: 'jedi', 'sith', 'rebel')
 */
export const requireAffiliation = (requiredAffiliation: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userAffiliation = req.user?.['custom:affiliation'];
    
    if (!userAffiliation || userAffiliation !== requiredAffiliation) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Acesso negado. Afiliação '${requiredAffiliation}' requerida.`
      });
    }
    
    next();
  };
};

/**
 * Middleware para verificar se o usuário pertence a um grupo específico
 * @param requiredGroup - Grupo requerido (ex: 'Admins', 'Users')
 */
export const requireGroup = (requiredGroup: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userGroups = req.user?.['cognito:groups'] || [];
    
    if (!userGroups.includes(requiredGroup)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: `Acesso negado. Grupo '${requiredGroup}' requerido.`
      });
    }
    
    next();
  };
};