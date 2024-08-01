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
