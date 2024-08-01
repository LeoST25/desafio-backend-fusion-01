import mongoose, { Schema, Document } from 'mongoose';

export interface ISpaceship extends Document {
    id: string;
    nome: string;
    modelo: string;
    fabricante: string;
    capacidadePassageiros: number;
  }

  const SpaceshipSchema: Schema = new Schema({
    nome: { type: String, required: true },
    modelo: { type: String, required: true },
    fabricante: { type: String, required: true },
    capacidadePassageiros: { type: Number, required: true },
  });
  
  export const Spaceship = mongoose.model<ISpaceship>('Spaceship', SpaceshipSchema);
  
  let spaceships: ISpaceship[] = [];
  
  // Função para obter todas as naves espaciais
  export const getAllSpaceships = (): ISpaceship[] => spaceships;
  
  // Função para obter uma nave espacial pelo ID
  export const getSpaceshipById = (id: string): ISpaceship | undefined => spaceships.find(s => s.id === id);
  
  // Função para criar uma nova nave espacial
  export const createSpaceship = (spaceship: ISpaceship): ISpaceship => {
    spaceships.push(spaceship);
    return spaceship;
  };
  
  // Função para atualizar uma nave espacial existente
  export const updateSpaceship = (id: string, updatedData: Partial<ISpaceship>): ISpaceship | null => {
    const spaceship = spaceships.find(s => s.id === id);
    if (spaceship) {
      Object.assign(spaceship, updatedData);
      return spaceship;
    }
    return null;
  };
  
  // Função para excluir uma nave espacial
  export const deleteSpaceship = (id: string): void => {
    spaceships = spaceships.filter(s => s.id !== id);
  };
  