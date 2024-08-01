import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware'; // Importar a interface correta

const router = express.Router();

// Rota protegida
router.get('/protected', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (req.user) {
    res.json({ message: 'This is a protected route', user: req.user });
  } else {
    res.status(403).json({ message: 'User not authenticated' });
  }
});

export default router;
