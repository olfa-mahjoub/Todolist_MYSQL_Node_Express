const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sign } = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../../../models");
const sequelizeObject = db.users;
const handleMessage = require("../../../helpers");
const { getPlainObject } = require("../../../utils/PlainObject");

require("dotenv").config();

// Récupération de la clé secrète pour JWT depuis .env
const SECRET_KEY = process.env.JWT_SECRET_KEY;

/**
 * Valider les champs requis (email et mot de passe)
 */
const validateUserInput = (email, password) => {
  if (!email || !password) {
    throw new Error("Email et mot de passe sont obligatoires.");
  }
};

/**
 * Vérifier si l'email est déjà utilisé
 */
const checkIfEmailExists = async (email) => {
  const existingUser = await sequelizeObject.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("L'email est déjà utilisé.");
  }
};

/**
 * Hacher le mot de passe de l'utilisateur
 */
const hashPassword = (password) => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

/**
 * Créer et retourner un JWT pour l'utilisateur
 */
const createJWT = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

/**
 * Inscrire un nouvel utilisateur avec email et mot de passe
 */
exports.registerWithEmail = async (req, res) => {
  try {
    const { nom, prenom, email, password, date_naissance, gender } = req.body;

    // Validation des champs d'entrée
    validateUserInput(email, password);

    // Vérification de l'existence de l'email
    await checkIfEmailExists(email);

    // Hachage du mot de passe
    const hashedPassword = hashPassword(password);

    // Génération des chaînes de vérification
    const verificationEmailString = uuidv4();

    // Préparation des données utilisateur
    const user = {
      nom,
      prenom,
      email,
      password: hashedPassword,
      image: req.file ? req.file.path : "",
      gender,
      date_naissance,
    };

    // Sauvegarde de l'utilisateur dans la base de données
    const newUser = await sequelizeObject.create(user);

    // Création du JWT
    const token = createJWT(newUser);   

    // Réponse avec succès et le JWT
    return handleMessage.successResponse(
      req,
      res,
      "Inscription réussie, vérifiez votre email pour le lien de validation.",
      { token }
    );
  } catch (error) {
    console.error(error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Une erreur est survenue lors de l'inscription."
    );
  }
};

exports.loginEmail = async (req, res) => {
  const email = req.body.email;
  //let condition = email ? { email: { [Op.like]: `[[:<:]]${email}[[:>:]]` } } : null;
  await sequelizeObject
    .findAll({ where: { email: email } })
    .then(async (data) => {
      var plainObject = await getPlainObject(data)[0];
      const result = validatePassword(req.body.password, plainObject.password);
      const jsontoken = sign({ result: plainObject }, process.env.JWT_SECRET_KEY, { expiresIn: "10d" });
      if (result) {
        //delete password
        plainObject.password = undefined;
        return handleMessage.successResponse(req, res, { user: plainObject, token: jsontoken });
      } else {
        return handleMessage.errorResponse(req, res, "email or password invalide");
      }
    })
    .catch((err) => {
      console.log(err);
      return handleMessage.errorResponse(req, res, "user not exist" || "email or password invalide");
    });
};

// Fonction pour vérifier si les données de connexion sont valides
const validateLoginInput = ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email et mot de passe sont requis.");
  }
};

// Fonction pour vérifier si l'utilisateur existe avec l'email fourni
const getUserByEmail = async (email) => {
  const user = await sequelizeObject.findOne({ where: { email } });
  if (!user) {
    throw new Error("Utilisateur non trouvé.");
  }
  return user;
};

// Fonction pour comparer le mot de passe fourni avec le mot de passe haché
const validatePassword = (providedPassword, storedPassword) => {
  return compareSync(providedPassword, storedPassword);
};

// Fonction pour générer un JWT après validation de l'authentification
const generateJwtToken = (user) => {
  return sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
};

// Fonction pour formater l'utilisateur (supprimer le mot de passe avant de renvoyer)
const formatUserResponse = (user) => {
  user.password = undefined;
  return user;
};

// Point d'entrée pour la connexion par email
exports.loginEmail = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des entrées
    validateLoginInput({ email, password });

    // Recherche de l'utilisateur par email
    const user = await getUserByEmail(email);

    // Validation du mot de passe
    const isPasswordValid = validatePassword(password, user.password);
    if (!isPasswordValid) {
      return handleMessage.errorResponse(
        req,
        res,
        "Email ou mot de passe invalide."
      );
    }

    // Génération du token JWT
    const token = generateJwtToken(user);

    // Formater l'utilisateur pour ne pas renvoyer le mot de passe
    const formattedUser = formatUserResponse(user);

    // Réponse avec l'utilisateur et le token JWT
    return handleMessage.successResponse(req, res, {
      user: formattedUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message || "Une erreur est survenue lors de la connexion."
    );
  }
};

// Mettre à jour un utilisateur par son ID
exports.update = async (req, res) => {
  try {
    const { id } = req.body;

    // Vérification que l'ID est bien présent
    if (!id) {
      return handleMessage.errorResponse(req, res, "ID est requis.");
    }

    // Préparer les données à mettre à jour
    const user = { ...req.body };

    // Ajouter l'image si présente dans la requête
    if (req.file) {
      user.image = req.file.path;
    }

    // Effectuer la mise à jour
    const [updatedCount] = await sequelizeObject.update(user, {
      where: { id },
    });

    // Vérifier si la mise à jour a réussi
    if (updatedCount === 1) {
      return handleMessage.successResponse(req, res, user);
    } else {
      return handleMessage.notFoundResponse(
        req,
        res,
        `Utilisateur avec id=${id} non trouvé ou aucune donnée à mettre à jour.`
      );
    }
  } catch (error) {
    console.error(error);
    return handleMessage.errorResponse(
      req,
      res,
      error.message ||
        `Erreur lors de la mise à jour de l'utilisateur avec l'ID=${id}`
    );
  }
};
