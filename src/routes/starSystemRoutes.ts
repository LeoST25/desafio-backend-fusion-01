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
// Rota para criar um novo sistema estelar
router.post('/', authenticateToken, createStarSystemController);
// Rota para obter um sistema estelar por ID
router.get('/:id', authenticateToken, getStarSystemByIdController);
// Rota para atualizar um sistema estelar existente
router.put('/:id', authenticateToken, updateStarSystemController);
// Rota para excluir um sistema estelar
router.delete('/:id', authenticateToken, deleteStarSystemController);

export default router;
