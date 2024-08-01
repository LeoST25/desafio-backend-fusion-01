import mongoose, { Schema, Document } from 'mongoose';
export interface ICharacter extends Document {
    id: string;
    nome: string;
    raça: string;
    afiliação: string; // Jedi, Sith, Rebelde, etc.
    planetaNatal: string; // ID do planeta natal
  }

  const CharacterSchema: Schema = new Schema({
    nome: { type: String, required: true },
    raça: { type: String, required: true },
    afiliação: { type: String, required: true },
    planetaNatal: { type: String, required: true },
  });
  
  export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);
  
  let characters: ICharacter[] = [];
  
  // Função para obter todos os personagens
  export const getAllCharacters = (): ICharacter[] => characters;
  
  // Função para obter um personagem pelo ID
  export const getCharacterById = (id: string): ICharacter | undefined => characters.find(c => c.id === id);
  
  // Função para criar um novo personagem
  export const createCharacter = (character: ICharacter): ICharacter => {
    characters.push(character);
    return character;
  };
  
  // Função para atualizar um personagem existente
  export const updateCharacter = (id: string, updatedData: Partial<ICharacter>): ICharacter | null => {
    const character = characters.find(c => c.id === id);
    if (character) {
      Object.assign(character, updatedData);
      return character;
    }
    return null;
  };
  
  // Função para excluir um personagem
  export const deleteCharacter = (id: string): void => {
    characters = characters.filter(c => c.id !== id);
  };
  