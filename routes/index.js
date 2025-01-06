"use strict";

// Importation des modules nécessaires
const express = require("express");
const router = express.Router();

// Importation des routes
require("../api/v1.0/users/User.routes")(router);
require("../api/v1.0/tasks/Tasks.routes")(router);
require("../api/v1.0/categories/Categories.routes")(router);

// Route de test
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the REST API." });
});

// Exportation du routeur
module.exports = router;
