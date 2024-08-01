import { Request, Response } from 'express';
import { Character } from '../models/characterModel';

// Função para obter todos os personagens
export const getAllCharactersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch characters', error: err });
  }
};

// Função para criar um novo personagem
export const createCharacterController = async (req: Request, res: Response): Promise<void> => {
  const { nome, raça, afiliação, planetaNatal } = req.body;
  if (!nome || !raça || !afiliação || !planetaNatal) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const newCharacter = new Character({ nome, raça, afiliação, planetaNatal });
    const createdCharacter = await newCharacter.save();
    res.status(201).json(createdCharacter);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create character', error: err });
  }
};

// Função para obter um personagem por ID
export const getCharacterByIdController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const character = await Character.findById(id);
    if (character) {
      res.json(character);
    } else {
      res.status(404).json({ message: 'Character not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch character', error: err });
  }
};

// Função para atualizar um personagem existente
export const updateCharacterController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedCharacter = await Character.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedCharacter) {
      res.json(updatedCharacter);
    } else {
      res.status(404).json({ message: 'Character not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update character', error: err });
  }
};

// Função para excluir um personagem
export const deleteCharacterController = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    await Character.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete character', error: err });
  }
};
