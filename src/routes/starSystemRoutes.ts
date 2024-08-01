import { Router } from 'express';
import { 
  getAllStarSystemsController,
  createStarSystemController,
  getStarSystemByIdController,
  updateStarSystemController,
  deleteStarSystemController 
} from '../controllers/starSystemController';

const router = Router();

// Rota para obter todos os sistemas estelares
router.get('/', getAllStarSystemsController);

// Rota para criar um novo sistema estelar
router.post('/', createStarSystemController);

// Rota para obter um sistema estelar por ID
router.get('/:id', getStarSystemByIdController);

// Rota para atualizar um sistema estelar existente
router.put('/:id', updateStarSystemController);

// Rota para excluir um sistema estelar
router.delete('/:id', deleteStarSystemController);

export default router;
