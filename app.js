"use strict";

const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const basicAuth = require("express-basic-auth");
const swaggerUi = require("swagger-ui-express");
const rateLimit = require("express-rate-limit");

// Import des fichiers locaux
const swaggerDocument = require("./swagger.json");
const indexRouter = require("./routes/index");

const app = express();

// ==============================
// Configuration du rate limiter
// ==============================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limite chaque IP à 1000 requêtes par fenêtre
});

// ==============================
// Middlewares globaux
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors()); // Ajout du middleware CORS pour la gestion des origines
app.use(limiter); // Limite le nombre de requêtes par IP

// Autorisations CORS spécifiques
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*");
  res.append("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Servir les fichiers statiques (ex : images uploadées)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==============================
// Documentation Swagger
// ==============================
app.use(
  "/api-docs",
  basicAuth({
    users: { root: "rtfgcv" }, // Changer les identifiants pour la sécurité
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// ==============================
// Routes principales
// ==============================
app.use("/api/v1", indexRouter);

// ==============================
// Gestion des routes inexistantes
// ==============================
app.use((req, res) => {
  res.status(404).send({
    message: "Not found!",
  });
});

app.use(
    "/api-docs",
    basicAuth({
      users: { root: "rtfgcv" },
      challenge: true,
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
// Export de l'application
module.exports = app;
