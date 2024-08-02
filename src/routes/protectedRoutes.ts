import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { AuthenticatedRequest } from '../middleware/authMiddleware'; // Importar a interface correta

const router = express.Router();

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Secured Endpoint
 *     tags: [Protected]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Protected content accessed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john_doe@example.com
 *                     affiliation:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["affiliation1", "affiliation2"]
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Usuário não autenticado
 */
// Rota protegida
router.get('/protected', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (req.user) {
    res.json({ 
      message: 'This is a protected route', 
      user: {
        email: req.user.email,
        affiliation: req.user.affiliation,
      },
    });
  } else {
    res.status(403).json({ message: 'User not authenticated' });
  }
});

export default router;
