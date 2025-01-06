const redis = require("redis");
const { promisify } = require("util");

// Création du client Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1", // Définir l'hôte à partir des variables d'environnement
  port: process.env.REDIS_PORT || 6379,       // Définir le port par défaut à 6379
  password: process.env.REDIS_PASSWORD || undefined, // Mot de passe si nécessaire
});

// Gestion des événements du client Redis
redisClient.on("ready", () => {
  console.log("✅ Redis is ready and connected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("🔗 Connected to Redis server");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Attempting to reconnect to Redis...");
});

redisClient.on("end", () => {
  console.log("🔌 Redis connection closed");
});

// Promisification des fonctions Redis
const GET_ASYNC = promisify(redisClient.get).bind(redisClient);
const SET_ASYNC = promisify(redisClient.set).bind(redisClient);

// Exportation des fonctions et du client
module.exports = {
  redisClient,
  GET_ASYNC,
  SET_ASYNC,
};
