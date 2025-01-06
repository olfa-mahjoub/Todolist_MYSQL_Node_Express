const db = require("../../../models");
const sequelizeObject = db.tasks;
const handleMessage = require("../../../helpers");
const { GET_ASYNC, SET_ASYNC } = require("../../../config/redis-client");
const { getPlainObject } = require("../../../utils/PlainObject");

/**
 * Crée une nouvelle tache et met à jour le cache Redis.
 */
exports.create = async (req, res) => {
  try {
    const data = await sequelizeObject.create(req.body);

    // Met à jour le cache Redis avec toutes les taches
    const allRecords = await sequelizeObject.findAll();
    await SET_ASYNC("tasks", JSON.stringify(allRecords), "EX", 50); // Expire dans 50 secondes

    const plainObject = await getPlainObject(data);
    return handleMessage.successResponse(req, res, plainObject);
  } catch (error) {
    console.error("Error creating category:", error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Error creating category."
    );
  }
};

/**
 * Récupère toutes les taches, en utilisant Redis si disponible.
 */
exports.getAll = async (req, res) => {
  try {
    const cachedData = await GET_ASYNC("tasks");

    if (cachedData) {
      const data = JSON.parse(cachedData);
      return handleMessage.successResponse(req, res, data);
    }

    const data = await sequelizeObject.findAll();
    await SET_ASYNC("tasks", JSON.stringify(data), "EX", 50);

    return handleMessage.successResponse(req, res, data);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Error fetching tasks."
    );
  }
};

/**
 * Récupère une tache par ID.
 */
exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const data = await sequelizeObject.findByPk(id);

    if (!data) {
      return handleMessage.notFoundResponse(req, res, "Category not found.");
    }

    return handleMessage.successResponse(req, res, data);
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Error fetching category by ID."
    );
  }
};

/**
 * Met à jour une tache par ID et rafraîchit le cache Redis.
 */
exports.update = async (req, res) => {
  const { id } = req.params;

  try {
    const [updated] = await sequelizeObject.update(req.body, { where: { id } });

    if (updated) {
      const updatedCategory = await sequelizeObject.findByPk(id);

      const allRecords = await sequelizeObject.findAll();
      await SET_ASYNC("tasks", JSON.stringify(allRecords), "EX", 50);

      return handleMessage.successResponse(req, res, updatedCategory);
    }

    return handleMessage.notFoundResponse(req, res, "Category not found.");
  } catch (error) {
    console.error("Error updating category:", error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Error updating category."
    );
  }
};

/**
 * Supprime une tache par ID et rafraîchit le cache Redis.
 */
exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await sequelizeObject.destroy({ where: { id } });

    if (deleted) {
      const allRecords = await sequelizeObject.findAll();
      await SET_ASYNC("tasks", JSON.stringify(allRecords), "EX", 50);

      return handleMessage.successResponseWithMessage(
        req,
        res,
        null,
        "Category deleted successfully."
      );
    }

    return handleMessage.notFoundResponse(req, res, "Category not found.");
  } catch (error) {
    console.error("Error deleting category:", error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Error deleting category."
    );
  }
};
