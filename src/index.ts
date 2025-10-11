import dotenv from 'dotenv';

// Carregar variáveis de ambiente primeiro
dotenv.config();

import express from 'express';
import cors from 'cors';
import planetRoutes from './routes/planetRoutes';
import starSystemRoutes from './routes/starSystemRoutes';
import characterRoutes from './routes/characterRoutes';
import spaceshipRoutes from './routes/spaceshipRoutes';
import connectDB from './database';
import authRoutes from './routes/authRoutes';
import cognitoAuthRoutes from './routes/cognitoAuthRoutes';
import protectedRoutes from './routes/protectedRoutes';
import setupSwagger from './swaggerConfig';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

connectDB();

// Configurar Swagger
setupSwagger(app);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, Star Wars Galaxy!");
});
app.use('/api/planets', planetRoutes);
app.use('/api/star-systems', starSystemRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/spaceships', spaceshipRoutes);
// Rotas de autenticação tradicionais (mantidas para compatibilidade)
app.use('/api/auth/legacy', authRoutes);
// Novas rotas de autenticação com Cognito
app.use('/api/auth', cognitoAuthRoutes);
app.use('/api', protectedRoutes);
app.use('/api', userRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API disponível em: http://localhost:${PORT}/api`);
}).on('error', (err) => {
  console.error('Erro ao iniciar servidor:', err);
});
