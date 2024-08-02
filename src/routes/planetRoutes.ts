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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e4"
 *                 nome:
 *                   type: string
 *                   example: Tatooine
 *                 clima:
 *                   type: string
 *                   example: Arid
 *                 terreno:
 *                   type: string
 *                   example: Desert
 *                 populacao:
 *                   type: integer
 *                   example: 200000
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/planets:
 *   get:
 *     summary: Get all planets
 *     tags: [Planets]
 *     responses:
 *       200:
 *         description: List of planets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4f7e8e3e8b0b8e8e3e4"
 *                   nome:
 *                     type: string
 *                     example: Tatooine
 *                   clima:
 *                     type: string
 *                     example: Arid
 *                   terreno:
 *                     type: string
 *                     example: Desert
 *                   populacao:
 *                     type: integer
 *                     example: 200000
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/planets/{id}:
 *   get:
 *     summary: Get a planet by ID
 *     tags: [Planets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e4"
 *     responses:
 *       200:
 *         description: Planet details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e4"
 *                 nome:
 *                   type: string
 *                   example: Tatooine
 *                 clima:
 *                   type: string
 *                   example: Arid
 *                 terreno:
 *                   type: string
 *                   example: Desert
 *                 populacao:
 *                   type: integer
 *                   example: 200000
 *       404:
 *         description: Planet not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/planets/{id}:
 *   put:
 *     summary: Update a planet by ID
 *     tags: [Planets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e4"
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
 *       200:
 *         description: Planet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e4"
 *                 nome:
 *                   type: string
 *                   example: Tatooine
 *                 clima:
 *                   type: string
 *                   example: Arid
 *                 terreno:
 *                   type: string
 *                   example: Desert
 *                 populacao:
 *                   type: integer
 *                   example: 200000
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Planet not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/planets/{id}:
 *   delete:
 *     summary: Delete a planet by ID
 *     tags: [Planets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e4"
 *     responses:
 *       204:
 *         description: Planet deleted successfully
 *       404:
 *         description: Planet not found
 *       500:
 *         description: Internal server error
 */

// Rota para obter todos os planetas
router.get('/', getAllPlanetsController);
// Rota para criar um novo planeta
router.post('/', authenticateToken, createPlanetController);
// Rota para obter um planeta por ID
router.get('/:id', getPlanetByIdController);
// Rota para atualizar um planeta
router.put('/:id', authenticateToken, updatePlanetController);
// Rota para excluir um planeta
router.delete('/:id', authenticateToken, deletePlanetController);

export default router;
