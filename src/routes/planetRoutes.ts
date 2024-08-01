import { Router } from 'express';
import { 
  getAllPlanetsController,
  createPlanetController,
  getPlanetByIdController,
  updatePlanetController,
  deletePlanetController
} from '../controllers/planetController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Planets
 *   description: API endpoints for managing planets
 */

/**
 * @swagger
 * /api/planets:
 *   post:
 *     summary: Create a new planet
 *     tags: [Planets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Tatooine
 *               clima:
 *                 type: string
 *                 example: Arid
 *               terreno:
 *                 type: string
 *                 example: Desert
 *               populacao:
 *                 type: integer
 *                 example: 200000
 *     responses:
 *       201:
 *         description: Planet created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

// Rota para obter todos os planetas
router.get('/', authenticateToken, getAllPlanetsController);
// Rota para criar um novo planeta
router.post('/', authenticateToken, createPlanetController);
// Rota para obter um planeta por ID
router.get('/:id', authenticateToken, getPlanetByIdController);
// Rota para atualizar um planeta
router.put('/:id', authenticateToken, updatePlanetController);
// Rota para excluir um planeta
router.delete('/:id', authenticateToken, deletePlanetController);

export default router;
