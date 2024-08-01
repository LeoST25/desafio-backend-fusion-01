import { Router } from 'express';
import { 
  getAllPlanetsController,
  createPlanetController,
  getPlanetByIdController,
  updatePlanetController,
  deletePlanetController
} from '../controllers/planetController';

const router = Router();

router.get('/', getAllPlanetsController);
router.post('/', createPlanetController);
router.get('/:id', getPlanetByIdController);
router.put('/:id', updatePlanetController);
router.delete('/:id', deletePlanetController);

export default router;
