import express from 'express';
import { authenticateToken, requireAffiliation, requireGroup } from '../middleware/cognitoAuthMiddleware';
import { AuthenticatedRequest } from '../middleware/cognitoAuthMiddleware'; // Importar a interface correta

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
      message: 'This is a protected route powered by AWS Cognito', 
      user: {
        userId: req.user.sub,
        email: req.user.email,
        username: req.user.username,
        affiliation: req.user['custom:affiliation'],
        groups: req.user['cognito:groups'] || [],
        clientId: req.user.client_id
      },
    });
  } else {
    res.status(403).json({ message: 'User not authenticated' });
  }
});

// Rota que requer afiliação Jedi
router.get('/jedi-only', authenticateToken, requireAffiliation('jedi'), (req: AuthenticatedRequest, res) => {
  res.json({
    message: 'May the Force be with you, Jedi!',
    user: req.user?.username || req.user?.email
  });
});

// Rota que requer grupo de Administradores
router.get('/admin-only', authenticateToken, requireGroup('Admins'), (req: AuthenticatedRequest, res) => {
  res.json({
    message: 'Welcome to the admin panel',
    user: req.user?.username || req.user?.email
  });
});

export default router;
