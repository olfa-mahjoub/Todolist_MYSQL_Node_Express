const app = require("./app"); // Import de l'application
const http = require("http");
const db = require("./models");

// Définir le port
const PORT = process.env.APP_PORT || 3000;

// Créer un serveur HTTP
const server = http.createServer(app);

db.sequelize.sync();

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});