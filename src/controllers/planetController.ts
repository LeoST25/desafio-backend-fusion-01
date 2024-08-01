import { Request, Response } from 'express';
import { getAllPlanets, getPlanetById, createPlanet, updatePlanet, deletePlanet } from '../models/planetModel';

export const getAllPlanetsController = (req: Request, res: Response): void => {
  res.json(getAllPlanets());
};

export const createPlanetController = (req: Request, res: Response): void => {
  const newPlanet = req.body;
  const createdPlanet = createPlanet(newPlanet);
  res.status(201).json(createdPlanet);
};

export const getPlanetByIdController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const planet = getPlanetById(id);
  if (planet) {
    res.json(planet);
  } else {
    res.status(404).json({ message: 'Planet not found' });
  }
};

export const updatePlanetController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedPlanet = updatePlanet(id, updatedData);
  if (updatedPlanet) {
    res.json(updatedPlanet);
  } else {
    res.status(404).json({ message: 'Planet not found' });
  }
};

export const deletePlanetController = (req: Request, res: Response): void => {
  const { id } = req.params;
  deletePlanet(id);
  res.status(204).end();
};
