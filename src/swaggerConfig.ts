import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Star Wars API',
      version: '1.0.0',
      description: 'API for managing Star Wars data',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(swaggerOptions);

const setupSwagger = (app: express.Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

export default setupSwagger;
