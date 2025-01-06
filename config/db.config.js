const dbConfig = require("./db.params");
const Sequelize = require("sequelize");
require("dotenv").config();

/* Creating a new instance of Sequelize. */
const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: dbConfig.dialect,
    define: {
      freezeTableName: true,
    },
    operatorsAliases: 0,
    dialectOptions: {
      /* Used to convert the date to local timezone. */
      // useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: function (field, next) {
        // for reading from database
        if (field.type === "DATETIME") {
          return field.string();
        }
        return next();
      },
    },
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);
module.exports = sequelize;
