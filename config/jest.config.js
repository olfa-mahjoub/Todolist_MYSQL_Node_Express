module.exports = {
    roots: ['<rootDir>/api/v1.0'], // Répertoire racine des tests dans `api/v1.0`
    testMatch: ['**/tests/**/*.test.js'], // Correspond aux fichiers test
    moduleNameMapper: {
      '^@config(.*)$': '<rootDir>/config$1', // Mapper les imports de config
      '^@helpers(.*)$': '<rootDir>/helpers$1', // Mapper les imports de helpers
      '^@models(.*)$': '<rootDir>/models$1', // Mapper les imports de modèles
      '^@routes(.*)$': '<rootDir>/routes$1', // Mapper les imports de routes
      '^@uploads(.*)$': '<rootDir>/uploads$1', // Mapper les imports de uploads
      '^@utils(.*)$': '<rootDir>/utils$1', // Mapper les imports de utils
    },
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Charge les configurations nécessaires avant les tests
    testEnvironment: 'node', // Spécifie que l'environnement des tests est Node.js
  };
  