import { Router } from 'express';
import { 
  getAllStarSystemsController,
  createStarSystemController,
  getStarSystemByIdController,
  updateStarSystemController,
  deleteStarSystemController 
} from '../controllers/starSystemController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rota para obter todos os sistemas estelares
router.get('/', authenticateToken, getAllStarSystemsController);
/**
 * @swagger
 * tags:
 *   name: Star Systems
 *   description: API endpoints for managing star systems
 */

/**
 * @swagger
 * /api/star-systems:
 *   post:
 *     summary: Create a new star system
 *     tags: [Star Systems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Tatoo System
 *               descricao:
 *                 type: string
 *                 example: A binary star system located in the Outer Rim Territories
 *               planetas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Tatooine
 *     responses:
 *       201:
 *         description: Star system created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *                 nome:
 *                   type: string
 *                   example: Tatoo System
 *                 descricao:
 *                   type: string
 *                   example: A binary star system located in the Outer Rim Territories
 *                 planetas:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Tatooine
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/star-systems:
 *   get:
 *     summary: Get all star systems
 *     tags: [Star Systems]
 *     responses:
 *       200:
 *         description: List of star systems
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *                   nome:
 *                     type: string
 *                     example: Tatoo System
 *                   descricao:
 *                     type: string
 *                     example: A binary star system located in the Outer Rim Territories
 *                   planetas:
 *                     type: array
 *                     items:
 *                       type: string
 *                       example: Tatooine
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/star-systems/{id}:
 *   get:
 *     summary: Get a star system by ID
 *     tags: [Star Systems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *     responses:
 *       200:
 *         description: Star system details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *                 nome:
 *                   type: string
 *                   example: Tatoo System
 *                 descricao:
 *                   type: string
 *                   example: A binary star system located in the Outer Rim Territories
 *                 planetas:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Tatooine
 *       404:
 *         description: Star system not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/star-systems/{id}:
 *   put:
 *     summary: Update a star system by ID
 *     tags: [Star Systems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Tatoo System
 *               descricao:
 *                 type: string
 *                 example: A binary star system located in the Outer Rim Territories
 *               planetas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: Tatooine
 *     responses:
 *       200:
 *         description: Star system updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *                 nome:
 *                   type: string
 *                   example: Tatoo System
 *                 descricao:
 *                   type: string
 *                   example: A binary star system located in the Outer Rim Territories
 *                 planetas:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: Tatooine
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Star system not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/star-systems/{id}:
 *   delete:
 *     summary: Delete a star system by ID
 *     tags: [Star Systems]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e5"
 *     responses:
 *       204:
 *         description: Star system deleted successfully
 *       404:
 *         description: Star system not found
 *       500:
 *         description: Internal server error
 */

// Rota para criar um novo sistema estelar
router.post('/', authenticateToken, createStarSystemController);
// Rota para obter um sistema estelar por ID
router.get('/:id', authenticateToken, getStarSystemByIdController);
// Rota para atualizar um sistema estelar existente
router.put('/:id', authenticateToken, updateStarSystemController);
// Rota para excluir um sistema estelar
router.delete('/:id', authenticateToken, deleteStarSystemController);

export default router;
