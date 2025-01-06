module.exports = (app) => {
    const sequelizeCtrl = require("./Categories.controllers");
    const router = require("express").Router();
    const { checkToken } = require("../../../utils/TokenValidations");
  
    // Routes pour les catégories
    router.post("/", checkToken, sequelizeCtrl.create);       // Créer une catégorie
    router.get("/", checkToken, sequelizeCtrl.getAll);        // Obtenir toutes les catégories
    router.get("/:id", checkToken, sequelizeCtrl.getById);    // Obtenir une catégorie par ID
    router.patch("/:id", checkToken, sequelizeCtrl.update);   // Mettre à jour une catégorie par ID
    router.delete("/:id", checkToken, sequelizeCtrl.delete);  // Supprimer une catégorie par ID
  
    // Utiliser le routeur pour les catégories
    app.use("/categories", router);
  };
  