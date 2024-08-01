export interface Character {
    id: string;
    nome: string;
    raça: string;
    afiliação: string; // Jedi, Sith, Rebelde, etc.
    planetaNatal: string; // ID do planeta natal
  }
  
  let characters: Character[] = [];
  
  // Função para obter todos os personagens
  export const getAllCharacters = (): Character[] => characters;
  
  // Função para obter um personagem pelo ID
  export const getCharacterById = (id: string): Character | undefined => characters.find(c => c.id === id);
  
  // Função para criar um novo personagem
  export const createCharacter = (character: Character): Character => {
    characters.push(character);
    return character;
  };
  
  // Função para atualizar um personagem existente
  export const updateCharacter = (id: string, updatedData: Partial<Character>): Character | null => {
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
  