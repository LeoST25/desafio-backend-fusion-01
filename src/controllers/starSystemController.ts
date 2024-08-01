import { Request, Response } from 'express';
import { StarSystem } from '../models/starSystemModel';

// Função para obter todos os sistemas solares
export const getAllStarSystemsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const starSystems = await StarSystem.find();
    res.json(starSystems);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para criar um novo sistema solar
export const createStarSystemController = async (req: Request, res: Response): Promise<void> => {
  const { nome, descricao, planetas } = req.body;

  if (!nome || !descricao || !Array.isArray(planetas)) {
    res.status(400).json({ message: 'All fields are required and planetas must be an array' });
    return;
  }

  try {
    const newStarSystem = new StarSystem({ nome, descricao, planetas });
    const createdStarSystem = await newStarSystem.save();
    res.status(201).json(createdStarSystem);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para obter um sistema solar por ID
export const getStarSystemByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const starSystem = await StarSystem.findById(id);
    if (starSystem) {
      res.json(starSystem);
    } else {
      res.status(404).json({ message: 'Star system not found' });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para tualizar um sistema solar existente
export const updateStarSystemController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedStarSystem = await StarSystem.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedStarSystem) {
      res.json(updatedStarSystem);
    } else {
      res.status(404).json({ message: 'Star system not found' });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para excluir um sistema solar
export const deleteStarSystemController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await StarSystem.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
