"use strict";

// Import des modules
const Sequelize = require("sequelize");
const sequelize = require("../config/db.config");

// Initialisation de l'objet `db`
const db = {};

// Configuration de Sequelize
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Importation des modèles
db.users = require("../api/v1.0/users/User.model")(sequelize, Sequelize);
db.categories = require("../api/v1.0/categories/Categories.model")(sequelize, Sequelize);
db.tasks = require("../api/v1.0/tasks/Tasks.model")(sequelize, Sequelize);

// Associations entre les modèles

// Un utilisateur peut avoir plusieurs tâches
db.users.hasMany(db.tasks, { foreignKey: "user_id", as: "tasks" });

// Une tâche appartient à un utilisateur
db.tasks.belongsTo(db.users, { foreignKey: "user_id", as: "user" });

// Une tâche appartient à une catégorie
db.tasks.belongsTo(db.categories, { foreignKey: "categorie_id", as: "category" });

// Exportation de l'objet `db`
module.exports = db;
