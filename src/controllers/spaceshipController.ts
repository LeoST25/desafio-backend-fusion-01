import { Request, Response } from 'express';
import { Spaceship } from '../models/spaceshipModel';

// Função para obter todos as naves espaciais
export const getAllSpaceshipsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const spaceships = await Spaceship.find();
    res.json(spaceships);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para criar uma nova nave espacial
export const createSpaceshipController = async (req: Request, res: Response): Promise<void> => {
  const { nome, modelo, fabricante, capacidadePassageiros } = req.body;

  if (!nome || !modelo || !fabricante || capacidadePassageiros === undefined) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const newSpaceship = new Spaceship({ nome, modelo, fabricante, capacidadePassageiros });
    const createdSpaceship = await newSpaceship.save();
    res.status(201).json(createdSpaceship);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para obter um nave espacial por ID
export const getSpaceshipByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const spaceship = await Spaceship.findById(id);
    if (spaceship) {
      res.json(spaceship);
    } else {
      res.status(404).json({ message: 'Spaceship not found' });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
// Função para atualizar uma nave espacial existente
export const updateSpaceshipController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedSpaceship = await Spaceship.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedSpaceship) {
      res.json(updatedSpaceship);
    } else {
      res.status(404).json({ message: 'Spaceship not found' });
    }
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Função para excluir uma nave espacial
export const deleteSpaceshipController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await Spaceship.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
