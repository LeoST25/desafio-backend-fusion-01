import { Router } from 'express';
import { 
  getAllCharactersController,
  createCharacterController,
  getCharacterByIdController,
  updateCharacterController,
  deleteCharacterController 
} from '../controllers/characterController';

const router = Router();

// Rota para obter todos os personagens
router.get('/', getAllCharactersController);

// Rota para criar um novo personagem
router.post('/', createCharacterController);

// Rota para obter um personagem por ID
router.get('/:id', getCharacterByIdController);

// Rota para atualizar um personagem existente
router.put('/:id', updateCharacterController);

// Rota para excluir um personagem
router.delete('/:id', deleteCharacterController);

export default router;
