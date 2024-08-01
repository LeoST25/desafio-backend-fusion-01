export interface Spaceship {
    id: string;
    nome: string;
    modelo: string;
    fabricante: string;
    capacidadePassageiros: number;
  }
  
  let spaceships: Spaceship[] = [];
  
  // Função para obter todas as naves espaciais
  export const getAllSpaceships = (): Spaceship[] => spaceships;
  
  // Função para obter uma nave espacial pelo ID
  export const getSpaceshipById = (id: string): Spaceship | undefined => spaceships.find(s => s.id === id);
  
  // Função para criar uma nova nave espacial
  export const createSpaceship = (spaceship: Spaceship): Spaceship => {
    spaceships.push(spaceship);
    return spaceship;
  };
  
  // Função para atualizar uma nave espacial existente
  export const updateSpaceship = (id: string, updatedData: Partial<Spaceship>): Spaceship | null => {
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
  