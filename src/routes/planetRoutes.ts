import { Router } from 'express';
import { 
  getAllPlanetsController,
  createPlanetController,
  getPlanetByIdController,
  updatePlanetController,
  deletePlanetController
} from '../controllers/planetController';

const router = Router();

router.get('/planet', getAllPlanetsController);
router.post('/planet', createPlanetController);
router.get('/planet:id', getPlanetByIdController);
router.put('/planet:id', updatePlanetController);
router.delete('/planet:id', deletePlanetController);

export default router;
