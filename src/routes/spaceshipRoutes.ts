import { Router } from 'express';
import { 
  getAllSpaceshipsController,
  createSpaceshipController,
  getSpaceshipByIdController,
  updateSpaceshipController,
  deleteSpaceshipController 
} from '../controllers/spaceshipController';

const router = Router();

// Rota para obter todas as naves espaciais
router.get('/', getAllSpaceshipsController);

// Rota para criar uma nova nave espacial
router.post('/', createSpaceshipController);

// Rota para obter uma nave espacial por ID
router.get('/:id', getSpaceshipByIdController);

// Rota para atualizar uma nave espacial existente
router.put('/:id', updateSpaceshipController);

// Rota para excluir uma nave espacial
router.delete('/:id', deleteSpaceshipController);

export default router;
