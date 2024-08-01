export interface Planet {
    id: string;
    nome: string;
    clima: string;
    terreno: string;
    populacao: number;
  }
  
  let planets: Planet[] = [];
  
  export const getAllPlanets = (): Planet[] => planets;
  export const getPlanetById = (id: string): Planet | undefined => planets.find(p => p.id === id);
  export const createPlanet = (planet: Planet): Planet => {
    planets.push(planet);
    return planet;
  };
  export const updatePlanet = (id: string, updatedData: Partial<Planet>): Planet | null => {
    const planet = planets.find(p => p.id === id);
    if (planet) {
      Object.assign(planet, updatedData);
      return planet;
    }
    return null;
  };
  export const deletePlanet = (id: string): void => {
    planets = planets.filter(p => p.id !== id);
  };
  