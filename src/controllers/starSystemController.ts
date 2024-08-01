import { Request, Response } from 'express';
import { 
  getAllStarSystems, 
  getStarSystemById, 
  createStarSystem, 
  updateStarSystem, 
  deleteStarSystem 
} from '../models/starSystemModel';

// Função para obter todos os sistemas estelares
export const getAllStarSystemsController = (req: Request, res: Response): void => {
  const starSystems = getAllStarSystems();
  res.json(starSystems);
};

// Função para criar um novo sistema estelar
export const createStarSystemController = (req: Request, res: Response): void => {
  const newStarSystem = req.body;
  if (!newStarSystem.id || !newStarSystem.nome || !newStarSystem.descricao || !Array.isArray(newStarSystem.planetas)) {
    res.status(400).json({ message: 'All fields are required and planetas must be an array' });
    return;
  }
  const createdStarSystem = createStarSystem(newStarSystem);
  res.status(201).json(createdStarSystem);
};

// Função para obter um sistema estelar por ID
export const getStarSystemByIdController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const starSystem = getStarSystemById(id);
  if (starSystem) {
    res.json(starSystem);
  } else {
    res.status(404).json({ message: 'Star System not found' });
  }
};

// Função para atualizar um sistema estelar existente
export const updateStarSystemController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedStarSystem = updateStarSystem(id, updatedData);
  if (updatedStarSystem) {
    res.json(updatedStarSystem);
  } else {
    res.status(404).json({ message: 'Star System not found' });
  }
};

// Função para excluir um sistema estelar
export const deleteStarSystemController = (req: Request, res: Response): void => {
  const { id } = req.params;
  deleteStarSystem(id);
  res.status(204).end();
};
