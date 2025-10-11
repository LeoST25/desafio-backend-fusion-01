// Arquivo de inicialização do MongoDB
// Cria o usuário e banco de dados para a aplicação

db = db.getSiblingDB('space_database');

// Criar coleções básicas se não existirem
db.createCollection('planets');
db.createCollection('starsystems');
db.createCollection('characters');
db.createCollection('spaceships');
db.createCollection('users');

// Inserir dados de exemplo (opcional)
db.planets.insertMany([
  {
    name: "Tatooine",
    climate: "arid",
    terrain: "desert",
    population: 200000,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Alderaan", 
    climate: "temperate",
    terrain: "grasslands, mountains",
    population: 2000000000,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

console.log('Base de dados space_database inicializada com dados de exemplo!');