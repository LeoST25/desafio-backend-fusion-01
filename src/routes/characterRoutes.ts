import { Router } from 'express';
import { 
  getAllCharactersController,
  createCharacterController,
  getCharacterByIdController,
  updateCharacterController,
  deleteCharacterController 
} from '../controllers/characterController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: API endpoints for managing characters
 */

/**
 * @swagger
 * /api/characters:
 *   post:
 *     summary: Create a new character
 *     tags: [Characters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Luke Skywalker
 *               raça:
 *                 type: string
 *                 example: Human
 *               afiliação:
 *                 type: string
 *                 example: Jedi
 *               planetaNatal:
 *                 type: string
 *                 example: Tatooine
 *     responses:
 *       201:
 *         description: Character created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *                 nome:
 *                   type: string
 *                   example: Luke Skywalker
 *                 raça:
 *                   type: string
 *                   example: Human
 *                 afiliação:
 *                   type: string
 *                   example: Jedi
 *                 planetaNatal:
 *                   type: string
 *                   example: Tatooine
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Get all characters
 *     tags: [Characters]
 *     responses:
 *       200:
 *         description: List of characters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *                   nome:
 *                     type: string
 *                     example: Luke Skywalker
 *                   raça:
 *                     type: string
 *                     example: Human
 *                   afiliação:
 *                     type: string
 *                     example: Jedi
 *                   planetaNatal:
 *                     type: string
 *                     example: Tatooine
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get a character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *     responses:
 *       200:
 *         description: Character details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *                 nome:
 *                   type: string
 *                   example: Luke Skywalker
 *                 raça:
 *                   type: string
 *                   example: Human
 *                 afiliação:
 *                   type: string
 *                   example: Jedi
 *                 planetaNatal:
 *                   type: string
 *                   example: Tatooine
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/characters/{id}:
 *   put:
 *     summary: Update a character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Luke Skywalker
 *               raça:
 *                 type: string
 *                 example: Human
 *               afiliação:
 *                 type: string
 *                 example: Jedi
 *               planetaNatal:
 *                 type: string
 *                 example: Tatooine
 *     responses:
 *       200:
 *         description: Character updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *                 nome:
 *                   type: string
 *                   example: Luke Skywalker
 *                 raça:
 *                   type: string
 *                   example: Human
 *                 afiliação:
 *                   type: string
 *                   example: Jedi
 *                 planetaNatal:
 *                   type: string
 *                   example: Tatooine
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/characters/{id}:
 *   delete:
 *     summary: Delete a character by ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d5f4f7e8e3e8b0b8e8e3e6"
 *     responses:
 *       204:
 *         description: Character deleted successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal server error
 */

// Rota para obter todos os personagens
router.get('/', getAllCharactersController);
// Rota para criar um novo personagem
router.post('/', authenticateToken, createCharacterController);
// Rota para obter um personagem por ID
router.get('/:id',  getCharacterByIdController);
// Rota para atualizar um personagem existente
router.put('/:id', authenticateToken, updateCharacterController);
// Rota para excluir um personagem
router.delete('/:id', authenticateToken, deleteCharacterController);

export default router;
