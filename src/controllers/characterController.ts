import { Request, Response } from 'express';
import { 
  getAllCharacters, 
  getCharacterById, 
  createCharacter, 
  updateCharacter, 
  deleteCharacter 
} from '../models/characterModel';

// Função para obter todos os personagens
export const getAllCharactersController = (req: Request, res: Response): void => {
  const characters = getAllCharacters();
  res.json(characters);
};

// Função para criar um novo personagem
export const createCharacterController = (req: Request, res: Response): void => {
  const newCharacter = req.body;
  if (!newCharacter.nome || !newCharacter.raça || !newCharacter.afiliação || !newCharacter.planetaNatal) {
  res.status(400).json({ message: 'All fields are required'});
  return;
}
const createdCharacter = createCharacter(newCharacter);
res.status(201).json(createdCharacter);
};

// Função para obter um personagem por ID
export const getCharacterByIdController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const character = getCharacterById(id);
  if (character) {
    res.json(character);
  } else {
    res.status(404).json({ message: 'Character not found' });
  }
};

// Função para atualizar um personagem existente
export const updateCharacterController = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedCharacter = updateCharacter(id, updatedData);
  if (updatedCharacter) {
    res.json(updatedCharacter);
  } else {
    res.status(404).json({ message: 'Character not found' });
  }
};

// Função para excluir um personagem
export const deleteCharacterController = (req: Request, res: Response): void => {
  const { id } = req.params;
  deleteCharacter(id);
  res.status(204).end();
};
