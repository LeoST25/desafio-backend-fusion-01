import { Request, Response } from 'express';
import { Planet } from '../models/planetModel'; // Importa 'Planet' como uma exportação nomeada

// Função para obter todos os planetas
export const getAllPlanetsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const planets = await Planet.find();
    res.json(planets);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch planets', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

// Função para criar um novo planeta
export const createPlanetController = async (req: Request, res: Response): Promise<void> => {
  const { nome, clima, terreno, população } = req.body;
  if (!nome || !clima || !terreno || !população) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const newPlanet = new Planet({ nome, clima, terreno, população });
    const createdPlanet = await newPlanet.save();
    res.status(201).json(createdPlanet);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create planet', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

// Função para obter um planeta por ID
export const getPlanetByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const planet = await Planet.findById(id);
    if (planet) {
      res.json(planet);
    } else {
      res.status(404).json({ message: 'Planet not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch planet', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

// Função para atualizar um planeta existente
export const updatePlanetController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedPlanet = await Planet.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedPlanet) {
      res.json(updatedPlanet);
    } else {
      res.status(404).json({ message: 'Planet not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update planet', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};

// Função para excluir um planeta
export const deletePlanetController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await Planet.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete planet', error: err instanceof Error ? err.message : 'Unknown error' });
  }
};
