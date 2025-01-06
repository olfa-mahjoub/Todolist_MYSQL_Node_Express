module.exports = (app) => {
  const sequelizeCtrl = require("./Tasks.controllers");
  const router = require("express").Router();
  const { checkToken } = require("../../../utils/TokenValidations");

  // Routes pour les taches
  router.post("/", checkToken, sequelizeCtrl.create); // Créer une tache
  router.get("/", checkToken, sequelizeCtrl.getAll); // Obtenir toutes les taches
  router.get("/:id", checkToken, sequelizeCtrl.getById); // Obtenir une tache par ID
  router.patch("/:id", checkToken, sequelizeCtrl.update); // Mettre à jour une tache par ID
  router.delete("/:id", checkToken, sequelizeCtrl.delete); // Supprimer une tache par ID

  // Utiliser le routeur pour les taches
  app.use("/tasks", router);
};
