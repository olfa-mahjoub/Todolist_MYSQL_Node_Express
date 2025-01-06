const express = require("express");
const sequelizeCtrl = require("./User.controllers");
const { checkToken } = require("../../../utils/TokenValidations");
const myMulter = require("../../../middleware/multer");

module.exports = (app) => {
  const router = express.Router();

  // Routes privées
  router.post(
    "/register-email",
    myMulter.uploadImg.single("image"),
    sequelizeCtrl.registerWithEmail
  );

  router.post(
    "/login-email",
    sequelizeCtrl.loginEmail
  );

  router.put(
    "/update-user",
    checkToken,
    myMulter.uploadImg.single("image"),
    sequelizeCtrl.update
  );

  // Attache les routes au chemin /users
  app.use("/users", router);
};
