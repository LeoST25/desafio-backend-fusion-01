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

// Rota para obter todos os personagens
router.get('/', authenticateToken, getAllCharactersController);
// Rota para criar um novo personagem
router.post('/', authenticateToken, createCharacterController);
// Rota para obter um personagem por ID
router.get('/:id', authenticateToken, getCharacterByIdController);
// Rota para atualizar um personagem existente
router.put('/:id', authenticateToken, updateCharacterController);
// Rota para excluir um personagem
router.delete('/:id', authenticateToken, deleteCharacterController);

export default router;
