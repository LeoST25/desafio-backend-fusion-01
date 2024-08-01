import { Request, Response } from 'express';
import { 
  getAllSpaceships, 
  getSpaceshipById, 
  createSpaceship, 
  updateSpaceship, 
  deleteSpaceship 
} from '../models/spaceshipModel';

// Função para obter todas as naves espaciais
export const getAllSpaceshipsController = (req: Request, res: Response): void => {
  const spaceships = getAllSpaceships();
  res.json(spaceships);
};

// Função para criar uma nova nave espacial
export const createSpaceshipController = (req: Request, res: Response): void => {
  const newSpaceship = req.body;
  if (!newSpaceship.id || !newSpaceship.nome || !newSpaceship.modelo || !newSpaceship.fabricante || newSpaceship.capacidadePassageiros === undefined) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  const createdSpaceship = createSpaceship(newSpaceship);
  res.status(201).json(createdSpaceship);
};

// Função para obter uma nave espacial por ID
export const getSpaceshipByIdController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const spaceship = getSpaceshipById(id);
  if (spaceship) {
    res.json(spaceship);
  } else {
    res.status(404).json({ message: 'Spaceship not found' });
  }
};

// Função para atualizar uma nave espacial existente
export const updateSpaceshipController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedSpaceship = updateSpaceship(id, updatedData);
  if (updatedSpaceship) {
    res.json(updatedSpaceship);
  } else {
    res.status(404).json({ message: 'Spaceship not found' });
  }
};

// Função para excluir uma nave espacial
export const deleteSpaceshipController = (req: Request, res: Response): void => {
  const { id } = req.params;
  deleteSpaceship(id);
  res.status(204).end();
};
