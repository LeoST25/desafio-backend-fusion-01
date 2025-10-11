import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import { Application } from 'express';

// Definição do Swagger com esquemas de segurança para Cognito
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Star Wars API - AWS Cognito Edition',
    version: '2.0.0',
    description: 'API Star Wars com autenticação AWS Cognito. Gerencie a Galáxia com segurança enterprise-grade.',
    contact: {
      name: 'Star Wars API Support',
      url: 'https://github.com/LeoST25/desafio-backend-fusion-01',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      swagger: 'http://localhost:3000/api-docs',
      description: 'Servidor de Desenvolvimento',
    },
  ],
  components: {
    securitySchemes: {
      // JWT Bearer token do Cognito (método principal)
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT do AWS Cognito (Access Token). Formato: Bearer {token}'
      },
      // OAuth2 flow do Cognito (para Hosted UI)
      CognitoOAuth2: {
        type: 'oauth2',
        description: 'AWS Cognito OAuth2 authentication',
        flows: {
          authorizationCode: {
            authorizationUrl: `https://${process.env.COGNITO_DOMAIN}/login`,
            tokenUrl: `https://${process.env.COGNITO_DOMAIN}/oauth2/token`,
            scopes: {
              'email': 'Acesso ao email do usuário',
              'openid': 'Acesso ao OpenID Connect',
              'profile': 'Acesso ao perfil do usuário'
            }
          }
        }
      }
    },
    schemas: {
      // Schema para resposta de erro
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Código de erro'
          },
          message: {
            type: 'string',
            description: 'Mensagem de erro'
          },
          details: {
            type: 'string',
            description: 'Detalhes adicionais do erro'
          }
        }
      },
      // Schema para usuário Cognito
      CognitoUser: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'ID único do usuário (sub)'
          },
          username: {
            type: 'string',
            description: 'Nome de usuário'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'Email do usuário'
          },
          affiliation: {
            type: 'string',
            enum: ['jedi', 'sith', 'rebel', 'empire', 'neutral'],
            description: 'Afiliação do usuário no universo Star Wars'
          },
          groups: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Grupos do Cognito que o usuário pertence'
          },
          userStatus: {
            type: 'string',
            description: 'Status do usuário no Cognito'
          }
        }
      }
    }
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Opções para o Swagger JSDoc
const options: Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Ajuste o caminho conforme necessário
};

const swaggerSpec = swaggerJsdoc(options);

// Função para configurar o Swagger na aplicação Express
export const setupSwagger = (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
