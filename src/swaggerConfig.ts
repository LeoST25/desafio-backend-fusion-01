import swaggerJsdoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import { Application } from 'express';

// Definição do Swagger com esquema de segurança Bearer
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'StarWarsAPI',
    version: '1.0.0',
    description: 'A API Star Wars permite criar e gerenciar a Galáxia Inspirada em Star Wars.',
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
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
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
