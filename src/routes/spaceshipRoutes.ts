import { Router } from 'express';
import { 
  getAllSpaceshipsController,
  createSpaceshipController,
  getSpaceshipByIdController,
  updateSpaceshipController,
  deleteSpaceshipController 
} from '../controllers/spaceshipController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Spaceships
 *   description: API endpoints for managing spaceships
 */

/**
 * @swagger
 * /api/spaceships:
 *   post:
 *     summary: Create a new spaceship
 *     tags: [Spaceships]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Home One
 *               modelo:
 *                 type: string
 *                 example: MC75
 *               fabricante:
 *                 type: string
 *                 example: Mon Calamari Shipyards
 *               capacidade_passageiros:
 *                 type: integer
 *                 example: 1200
 *     responses:
 *       201:
 *         description: Spaceship created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *                 nome:
 *                   type: string
 *                   example: Home One
 *                 modelo:
 *                   type: string
 *                   example: MC75
 *                 fabricante:
 *                   type: string
 *                   example: Mon Calamari Shipyards
 *                 capacidade_passageiros:
 *                   type: integer
 *                   example: 1200
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/spaceships:
 *   get:
 *     summary: Get all spaceships
 *     tags: [Spaceships]
 *     responses:
 *       200:
 *         description: List of spaceships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *                   nome:
 *                     type: string
 *                     example: Home One
 *                   modelo:
 *                     type: string
 *                     example: MC75
 *                   fabricante:
 *                     type: string
 *                     example: Mon Calamari Shipyards
 *                   capacidade_passageiros:
 *                     type: integer
 *                     example: 1200
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/spaceships/{id}:
 *   get:
 *     summary: Get a spaceship by ID
 *     tags: [Spaceships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *     responses:
 *       200:
 *         description: Spaceship details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *                 nome:
 *                   type: string
 *                   example: Home One
 *                 modelo:
 *                   type: string
 *                   example: MC75
 *                 fabricante:
 *                   type: string
 *                   example: Mon Calamari Shipyards
 *                 capacidade_passageiros:
 *                   type: integer
 *                   example: 1200
 *       404:
 *         description: Spaceship not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/spaceships/{id}:
 *   put:
 *     summary: Update a spaceship by ID
 *     tags: [Spaceships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Home One
 *               modelo:
 *                 type: string
 *                 example: MC75
 *               fabricante:
 *                 type: string
 *                 example: Mon Calamari Shipyards
 *               capacidade_passageiros:
 *                 type: integer
 *                 example: 1200
 *     responses:
 *       200:
 *         description: Spaceship updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *                 nome:
 *                   type: string
 *                   example: Home One
 *                 modelo:
 *                   type: string
 *                   example: MC75
 *                 fabricante:
 *                   type: string
 *                   example: Mon Calamari Shipyards
 *                 capacidade_passageiros:
 *                   type: integer
 *                   example: 1200
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Spaceship not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/spaceships/{id}:
 *   delete:
 *     summary: Delete a spaceship by ID
 *     tags: [Spaceships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e7"
 *     responses:
 *       204:
 *         description: Spaceship deleted successfully
 *       404:
 *         description: Spaceship not found
 *       500:
 *         description: Internal server error
 */

// Rota para obter todas as naves espaciais
router.get('/', authenticateToken, getAllSpaceshipsController);
// Rota para criar uma nova nave espacial
router.post('/', authenticateToken, createSpaceshipController);
// Rota para obter uma nave espacial por ID
router.get('/:id', authenticateToken, getSpaceshipByIdController);
// Rota para atualizar uma nave espacial existente
router.put('/:id', authenticateToken, updateSpaceshipController);
// Rota para excluir uma nave espacial
router.delete('/:id', authenticateToken, deleteSpaceshipController);

export default router;
