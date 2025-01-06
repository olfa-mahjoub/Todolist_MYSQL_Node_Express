// tests/categories.controller.test.js
const request = require('supertest');
const app = require('../app'); // L'application Express
const db = require('../models');
const { GET_ASYNC, SET_ASYNC } = require('../config/redis-client');
jest.mock('../config/redis-client'); // Mock des fonctions Redis

describe('Categories Controller', () => {
  let categoryData;

  beforeAll(() => {
    // Exemple de donnée de catégorie pour les tests
    categoryData = {
      name: 'Test Category',
      description: 'Description de la catégorie de test',
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Nettoyer les mocks après chaque test
  });

  it('should create a new category and update Redis cache', async () => {
    // Mock de la méthode Sequelize `create` pour simuler une insertion en base
    db.categories.create = jest.fn().mockResolvedValue(categoryData);

    // Mock du GET_ASYNC pour renvoyer une réponse fictive
    GET_ASYNC.mockResolvedValue(null);  // Assure que les données ne sont pas en cache au début

    // Mock du SET_ASYNC pour éviter d'effectuer réellement la mise à jour dans Redis
    SET_ASYNC.mockResolvedValue('OK');

    const response = await request(app)
      .post('/categories')
      .send(categoryData);

    expect(response.status).toBe(200); // Vérifie que le statut est OK
    expect(response.body.data).toEqual(categoryData); // Vérifie la réponse renvoyée
    expect(SET_ASYNC).toHaveBeenCalledTimes(1); // Vérifie que le cache a été mis à jour
  });
});
