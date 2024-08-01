import mongoose, { Schema, Document } from "mongoose";

export interface IStarSystem extends Document {
    id: string;
    nome: string;
    descricao: string;
    planetas: string[]; // IDs dos planetas
  }

  const StarSystemSchema: Schema = new Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    planetas: { type: [String], required: true },
  });

  export const StarSystem = mongoose.model<IStarSystem>('StarSystem', StarSystemSchema);
  
  let starSystems: IStarSystem[] = [];
  
  // Função para obter todos os sistemas estelares
  export const getAllStarSystems = (): IStarSystem[] => starSystems;
  
  // Função para obter um sistema estelar pelo ID
  export const getStarSystemById = (id: string): IStarSystem | undefined => starSystems.find(s => s.id === id);
  
  // Função para criar um novo sistema estelar
  export const createStarSystem = (starSystem: IStarSystem): IStarSystem => {
    starSystems.push(starSystem);
    return starSystem;
  };
  
  // Função para atualizar um sistema estelar existente
  export const updateStarSystem = (id: string, updatedData: Partial<IStarSystem>): IStarSystem | null => {
    const starSystem = starSystems.find(s => s.id === id);
    if (starSystem) {
      Object.assign(starSystem, updatedData);
      return starSystem;
    }
    return null;
  };
  
  // Função para excluir um sistema estelar
  export const deleteStarSystem = (id: string): void => {
    starSystems = starSystems.filter(s => s.id !== id);
  };
  