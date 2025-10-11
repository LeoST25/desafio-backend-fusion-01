import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "Hello, Star Wars Galaxy!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Test API: http://localhost:${PORT}/api/test`);
}).on('error', (err) => {
  console.error('Server error:', err);
});