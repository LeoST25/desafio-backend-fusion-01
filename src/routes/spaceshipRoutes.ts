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
