import mongoose, { Schema, Document } from "mongoose";

export interface IPlanet extends Document {
    id: string;
    nome: string;
    clima: string;
    terreno: string;
    populacao: number;
  }

  const PlanetSchema: Schema = new Schema({
    nome: { type: String, required: true},
    clima: { type: String, required: true},
    terreno: { type: String, required: true},
    populacao: { type: Number, required: true},
  });

  export const Planet = mongoose.model<IPlanet>('Planet', PlanetSchema);
  
  let planets: IPlanet[] = [];
  
  export const getAllPlanets = (): IPlanet[] => planets;
  export const getPlanetById = (id: string): IPlanet | undefined => planets.find(p => p.id === id);
  export const createPlanet = (planet: IPlanet): IPlanet => {
    planets.push(planet);
    return planet;
  };
  export const updatePlanet = (id: string, updatedData: Partial<IPlanet>): IPlanet | null => {
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
  